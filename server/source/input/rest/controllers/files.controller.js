const express = require('express')
const router = express.Router
const path = require('path')
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg');
const storage = multer.diskStorage(
    {
        destination: path.resolve(process.cwd(), 'storage'),
    }
)

const fs = require('fs')

const recordingDir = path.join(process.cwd(), 'storage/recording/')

class FilesController {
    constructor(
        loadPhotoUseCase,
        loadPDFUseCase,
        getPhotoByNameUseCase,
        authMiddleware,
    ) {
        this.path = '/files'
        this.router = router()

        this.loadPhotoUseCase = loadPhotoUseCase
        this.loadPDFUseCase = loadPDFUseCase
        this.getPhotoByNameUseCase = getPhotoByNameUseCase

        this.authMiddleware = authMiddleware
    }

    initializeRoutes() {
        this.router.all('/*')
        this.router.post(
            '/photo',
            multer({storage: storage}).single('photo'),
            this.loadPhoto.bind(this)
        )
        this.router.post(
            '/pdf',
            multer({storage: storage}).single('pdfFile'),
            this.loadPDF.bind(this)
        )
        this.router.post(
            '/video',
            multer({ storage: storage }).single('chunk'),
            this.loadVideo.bind(this)
        )

        this.router.post(
            '/encode',
            this.encode.bind(this)
        )
        this.router.get('/photo', this.getPhotoByFilename.bind(this))
        this.router.get('/pdf', this.getPdf.bind(this))
        this.router.get('/pdfList', this.getPdfList.bind(this))   
        this.router.get('/getVideoData', this.getVideoByFilename.bind(this))
        this.router.get('/recordFileName', this.getRecordedFileName.bind(this))
    }

    async loadPhoto(req, res, next) {
        try {
            const createdFile = await this.loadPhotoUseCase.loadPhoto(req.file)
            return res.status(201).send({
                filename: createdFile.name
            })
        } catch(err) {
            next(err)
        }
    }

    async loadPDF(req, res, next) {
        try {
            const createdFile = await this.loadPDFUseCase.loadPDF(req.file)
            return res.status(201).send({
                filename: createdFile.name
            })
        } catch(err) {
            next(err)
        }
    }

    async loadVideo(req, res, next) {
        try {
            const { chunkNumber, totalChunks, fileName } = req.body;
            const chunkPath = req.file.path;
            const chunkDir = path.join(process.cwd(), 'storage', fileName);

            // Ensure the directory for storing chunks exists
            if (!fs.existsSync(chunkDir)) {
                fs.mkdirSync(chunkDir);
            }

            // Move chunk to the appropriate directory
            const chunkFilePath = path.join(chunkDir, `chunk-${chunkNumber}`);
            fs.renameSync(chunkPath, chunkFilePath);

            // If this is the last chunk, merge and encode all chunks
            if (parseInt(chunkNumber) + 1 === parseInt(totalChunks)) {
                const mergedFilename = `merged-${new Date().getTime() + fileName}`;
                const mergedFilePath = path.join(process.cwd(), 'storage', mergedFilename);
                await this.mergeChunks(chunkDir, totalChunks, mergedFilePath);
                return res.status(201).send({
                    filename: mergedFilename,
                })
            } else {
                return res.status(200).send({
                    message: 'Chunk uploaded'
                })
            }
        } catch (err) {
            next(err)
        }
    }

    async encode(req, res, next) {
        const mergedFilename = req.body.mergedFilename
        const fileName = req.body.fileName
        const mergedFilePath = path.join(process.cwd(), 'storage', mergedFilename);
        // Derive the encoded file name from the original file name
        const encodedFileName = `encoded-${path.parse(fileName).name}-${new Date().getTime()}.mp4`;
        const encodedFilePath = path.join(process.cwd(), 'storage', encodedFileName);
        
        await this.encodeVideo(mergedFilePath, encodedFilePath);

        return res.status(201).send({
            filename: encodedFileName
        })
    }

    mergeChunks(chunkDir, totalChunks, outputFilePath) {
        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(outputFilePath);
            for (let i = 0; i < totalChunks; i++) {
                const chunkFile = path.join(chunkDir, `chunk-${i}`);
                writeStream.write(fs.readFileSync(chunkFile));
                fs.unlinkSync(chunkFile); // Delete chunk after appending
            }
            writeStream.end(() => {
                fs.rmdirSync(chunkDir); // Remove the chunk directory after merging
                resolve();
            });
        });
    }

    async getPdfList(req, res, next) {
        try {
            const fileList = await this.loadPDFUseCase.getPdfList()
            return res.status(200).send(fileList)
        } catch(err) {
            next(err)
        }
    }

    async getPhotoByFilename(req, res, next) {
        try {
            let photo = await this.getPhotoByNameUseCase.getPhotoByFilename(req.query.filename)

            if (!photo) {
                let defaultPath = await this.getPhotoByNameUseCase.getPhotoByFilename("default.png")
                return res.status(200).sendFile(defaultPath)
            }
            return res.status(200).sendFile(photo)
        } catch(err) {
            next(err)
        }
    }

    async getVideoByFilename(req, res, next) {
        try {
            let video = await this.getPhotoByNameUseCase.getVideoByFilename(req.query.filename, req.query.videoType)
            console.log(video)
            if (!video) {
                return res.status(404).send("Video is not found")
            }
            return res.status(200).sendFile(video)
        } catch(err) {
            next(err)
        }
    }

    async getPdf(req, res, next) {
        try {
            let pdf = await this.getPhotoByNameUseCase.getPhotoByFilename(req.query.filename)
            return res.status(200).sendFile(pdf)
        } catch(err) {
            next(err)
        }
    }

    encodeVideo = (inputPath, outputPath) => {
        return new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .output(outputPath)
            .videoCodec('libx264') // Using H.264 codec
            .audioCodec('aac') // Using AAC codec for audio
            .videoBitrate('1000k') // Setting video bitrate
            .size('1280x720') // Setting output video size
            .on('end', () => {
              console.log('Encoding completed successfully');
              resolve();
            }) 
            .on('error', (err) => {
              console.error('Error during encoding:', err);
              reject(err);
            })  

            .run();
        });
    };

    getRecordedFileName(req, res) {
        const files = fs.readdirSync(recordingDir);
        const flvFiles = files.filter(file => path.extname(file) === '.flv');
        if (flvFiles.length === 0) {
            return res.status(201).send(null)
        }
        // Sort files by modification time (most recent first)
        const filteredFiles = flvFiles.filter(item => item.includes(req.query.streamKey))
        if (filteredFiles.length === 0) {
            return res.status(201).send(null)
        }
        const sortedFiles = filteredFiles
            .map(file => ({
                file,
                time: file.split('-')[1].split('.')[0],
            }))
            .sort((a, b) => b.time - a.time);
        return res.status(201).send(sortedFiles[0].file)
    };
}

module.exports = FilesController

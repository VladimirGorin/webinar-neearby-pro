const fs = require("fs");
const path = require("path");

class Storage {
    constructor(STORAGE_CONFIG, generateRandomName) {
        this.path = STORAGE_CONFIG.PATH
        this.flvPath = STORAGE_CONFIG.FLVPATH
        this.fileNameLength = STORAGE_CONFIG.FILE_NAME_LENGTH
        this.generateRandomName = generateRandomName
    }

    checkDir() {
        if (!fs.existsSync(path.resolve(this.path))) {
            fs.mkdirSync(path.resolve(this.path), {recursive: true}, (err) => {
                if (err) throw err;
            });
        }
    }

    async addTempFileFromFileObject(file) {
        this.checkDir()
        const extArr = file.originalname.split('.')
        const fileExt = extArr[extArr.length - 1]
        let filename = file.originalname.split('.')[0]
        filename = filename.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '');;
        const date = new Date()
        filename =  filename + date.getTime()
        const generatedFileName = `${filename}.${fileExt}`

        fs.renameSync(path.resolve(this.path, file.filename), path.resolve(this.path, generatedFileName))
        return {
            name: generatedFileName,
            extension: fileExt
        }
    }

    getPath(fileName) {
        const filePath = path.resolve(this.path, fileName)

        if (!fs.existsSync(filePath)) {
            return false
        }

        return filePath
    }

    getFlvPath(filename) {
        const filePath = path.resolve(this.flvPath, filename)
        console.log(filePath, this.flvPath)
        if (!fs.existsSync(filePath)) {
            return false
        }

        return filePath
    }

    existsSync(path) {
        return fs.existsSync(path)
    }

    getFileByFilename(filename) {
        const path = this.getPath(filename)
        return fs.readFileSync(path)
    }

    async getPdfList() {
        this.checkDir()
        let pdfFiles = fs.readdirSync(this.path)
        pdfFiles = pdfFiles.filter(file => path.extname(file).toLowerCase() === '.pdf');
        return pdfFiles
    }
}

module.exports = Storage

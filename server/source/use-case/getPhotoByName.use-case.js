class GetPhotoByNameUseCase {
    constructor(storage) {
        this.storage = storage
    }

    async getPhotoByFilename(filename) {
        return this.storage.getPath(filename)
    }

    async getVideoByFilename(filename, videoType) {
        if (videoType == 1) {
            return this.storage.getFlvPath(filename)
        } else {
            return this.storage.getPath(filename)
        }
    }

    async getAllPdf(filename) {
        return this.storage.getAllPdf(filename)
    }
}

module.exports = GetPhotoByNameUseCase

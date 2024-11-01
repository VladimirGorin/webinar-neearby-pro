class GhosteUseCase {
    constructor(
        userRepository
    ) {
        this.userRepository = userRepository
    }

    async getGhosteByName({
        name,
        webinarId,
    }) {
        return await this.userRepository.getGhosteByName({
            name,
            webinarId,
        })
    }

    async createGhoste({
        name,
        webinarId,
        translationId = null
    }) {
        return await this.userRepository.createGhoste({
            name,
            webinarId,
            translationId
        })
    }

    async getModeratorList() {
        return await this.userRepository.getModeratorList()
    }

    async getAdminInfo(userId) {
        return await this.userRepository.getAdminInfo(userId)
    }
}

module.exports = GhosteUseCase

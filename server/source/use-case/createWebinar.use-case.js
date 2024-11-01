class CreateWebinarUseCase {
    constructor(
        webinarRepository,
        broadcastRepository,
        userWebinarRepository,
    ) {
        this.webinarRepository = webinarRepository
        this.broadcastRepository = broadcastRepository
        this.userWebinarRepository = userWebinarRepository
    }

    async createWebinar(webinarData){
        let insertId = 0
        let { moderators, ...webinar } = webinarData
        const isAutowebinar = webinar.isAutowebinar
        webinar.dateStart = webinar.dateStart.replace('T', ' ')
        webinar.dateCreated = webinar.dateCreated.replace('T', ' ')
        delete webinar.isAutowebinar
        if (isAutowebinar == 1) {
            webinar.status = 1
            insertId = await this.broadcastRepository.createBroadcast(webinar)
        } else {
            delete webinar.videoType
            insertId = await this.webinarRepository.createWebinar(webinar)
        }

        if (isAutowebinar == 0 && insertId) {
            const promises = []

            for (const moderId of webinarData.moderators) {
                promises.push(
                    this.userWebinarRepository.createUserWebinar({
                        userId: moderId,
                        webinarId: insertId,
                    })
                )
            }

            await Promise.all(promises)
        }
        return insertId
    }

    async checkWebinarUrl(webinarData) {
        let result = null
        result = await this.webinarRepository.checkWebinarUrl(webinarData)
        return result
    }
}

module.exports = CreateWebinarUseCase

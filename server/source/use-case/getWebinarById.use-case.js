class GetWebinarByIdUseCase {
    constructor(
        webinarRepository,
    ) {
        this.webinarRepository = webinarRepository
    }
    async getWebinarById(params) {
        const webinar = await this.webinarRepository.getWebinarById(params)

        if (!webinar) {
            throw new Error(JSON.stringify({
                status: 404,
                message: `Webinar(auto) with id ${params.id} not found`,
            }))
        }

        return webinar
    }
    
    async getModerator(params) {
        let moderator = null;
        moderator = await this.webinarRepository.getModerator(params);

        return moderator;
    }
}

module.exports = GetWebinarByIdUseCase

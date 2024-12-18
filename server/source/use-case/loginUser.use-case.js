const jwt = require('jsonwebtoken')

class LoginUserUseCase {
    constructor(
        userRepository,
        jwtSecret,
        crypt
    ) {
        this.userRepository = userRepository
        this.jwtSecret = jwtSecret
        this.crypt = crypt
    }
    async login(loginData){
        console.log(loginData)
        const user = await this.userRepository.getUserByLogin(loginData.login)
        console.log(`\n\n${user}\n\n`)

        if (!user) {
            throw new Error(JSON.stringify({
                status: 404,
                message: `User with login ${loginData.login} not found`,
            }))
        }

        if (!this.crypt.compareSync(loginData.password, user.password)) {
          console.log('here')
            throw new Error(JSON.stringify({
                status: 400,
                message: `User login failed`,
            }))
        }

        return this._createToken(loginData, this.jwtSecret)
    }

    _createToken(tokenData, jwtSecret) {
        return jwt.sign({
            login: tokenData.login,
        }, jwtSecret)
    }
}

module.exports = LoginUserUseCase

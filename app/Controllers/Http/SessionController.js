'use strict'

/**
 * Manages sessions in the app
 */
class SessionController {
    async create ({ request, auth }) {
        const { email, password } = request.all();

        const token = await auth
            .withRefreshToken()
            .attempt(email, password);
        
        return token;
    }

    async refresh ({ request, auth }) {
        const { refresh_token } = request.all();

        const newToken = await auth
            .newRefreshToken()
            .generateForRefreshToken(refresh_token);
    
        return newToken;
    }
}

module.exports = SessionController

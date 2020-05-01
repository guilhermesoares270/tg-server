'use strict'

const User = use("App/Models/User");
const Enterprise = use("App/Models/Enterprise");
/**
 * Manages sessions in the app
 */
class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all();

    const user = await User.findBy('email', email);
    if (!user) return {};
    const enterprise = await Enterprise.findBy('id', user.enterprise_id);

    const token = await auth
      .withRefreshToken()
      .attempt(email, password, { email, password, enterprise });

    console.log(`${enterprise.cnpj} SessionController: ${JSON.stringify(token)}`);

    // return token;
    return {
      ...token,
      enterprise_cnpj: enterprise.cnpj,
    };
  }

  async refresh({ request, auth }) {
    const { refresh_token } = request.all();

    const newToken = await auth
      .newRefreshToken()
      .generateForRefreshToken(refresh_token);

    return newToken;
  }
}

module.exports = SessionController

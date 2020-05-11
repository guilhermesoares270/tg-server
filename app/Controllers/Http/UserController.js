'use strict'

const User = use("App/Models/User");
const Token = use("App/Models/Token");
const Enterprise = use("App/Models/Enterprise");

const Database = use('Database')

const HashHelper = use('App/Support/HashHelper');
const FileHelper = use('App/Support/FileHelper');
const Helpers = use('Helpers');

class UserController {

  async create({ request }) {
    const data = request.only(["username", "email", "password"]);
    const razao_social = request.only(["razao_social"]).razao_social;

    try {
      const enterprise = await Enterprise.findBy("razao_social", razao_social);
      if (enterprise == null) throw Error('Enterprise not found');

      const newData = {
        ...data,
        enterprise_id: enterprise ? enterprise.id : null,
        enterprise_cnpj: enterprise ? enterprise.cnpj : null,
      }

      const newUser = await User.create(newData);

      return {
        data: Object.assign(newUser, { enterprise_razao_social: enterprise ? enterprise.razao_social : null }),
        errors: []
      };
    } catch (error) {
      return {
        data: null,
        errors: [error.message],
      };
    }
  }

  async alter({ request, params }) {
    const { id } = params;
    const data = request.only(["username", "email", "password"]);

    const user = await User.findBy(
      "id", id
    );

    const { ...newData } = data;
    user.merge(newData);

    await user.save();

    return user;
  }

  async get({ params }) {
    return await User.findBy(
      "id", params.id
    );
  }

  async index() {
    return await User.all();
  }

  async delete({ params }) {
    const user = await User.findBy(
      "id", params.id
    );
    if (!user) return {};
    await Database.table('tokens').select('*').where('user_id', user.id).delete();

    return user.delete();
  }

  async hashFile({ request, response }) {

    try {
      const file = request.file('File', {});

      const res = await FileHelper.moveToTemp(file);

      if (!res) {
        throw 'Couldn\' move the file to a temp location';
      }

      const filePath = `${Helpers.tmpPath('uploads')}/deu-certo.${file.extname}`;
      return await HashHelper.hash(filePath, 'sha256');

    } catch (error) {
      return response.send({ 'error': error });
    }
  }

  async generateKeys({ request, response }) {

    try {
      return HashHelper.generateKeyPairs();
    } catch (error) {
      return response.send({ 'error': error });
    }
  }

  async createSignedJWT({ request, response }) {
    return HashHelper.hteste(
      '173013304aeec4e49cc6718cb4caeccb',
      'my.vuw.ac.nz/sda-file-association',
      '2016-01'
    );
  }
}

module.exports = UserController

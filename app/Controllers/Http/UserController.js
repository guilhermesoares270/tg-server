'use strict'

const User = use("App/Models/User");
const HashHelper = use('App/Support/HashHelper');
const FileHelper = use('App/Support/FileHelper');
const Helpers = use('Helpers');

class UserController {

  async create({ request }) {
    const data = request.only(["username", "email", "password"]);
    return await User.create(data);
  }

  async alter({ request }) {
    const data = request.only(["username", "email", "password"]);

    const user = await User.findBy(
      "email", data.email
    );

    const { ...newData } = data;
    user.merge(newData);

    await user.save();

    return user;
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

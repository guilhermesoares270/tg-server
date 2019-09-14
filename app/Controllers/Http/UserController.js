'use strict'

const User = use("App/Models/User");
const HashHelper = use('App/Support/HashHelper');
const FileHelper = use('App/Support/FileHelper');
const Helpers = use('Helpers');

class UserController {
    async create ({ request }) {
        const data = request.only(["username", "email", "password"]);

        const user = await User.create(data);

        return user;
    }

    async alter ({ request }) {
        const data = request.only(["username", "email", "password"]);

        const user = await User.findBy(
            "email", data.email
        );

        const { ...newData } = data;
        user.merge(newData);

        await user.save();

        return user;
    }

    async hashFile ({ request, response }) {

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

    async createJWT({ request, response }) {
        return await HashHelper.createJWT({
            nome: 'Random string',
            pass: 'pass'
        });
    }
}

module.exports = UserController

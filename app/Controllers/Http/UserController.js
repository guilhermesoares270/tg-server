'use strict'

const User = use("App/Models/User");
const HashHelper = use('App/Support/HashHelper');
const FileHelper = use('App/Support/FileHelper');
const Helpers = use('Helpers');
const Ethereum = use('App/Services/Ethereum');

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
        // return await HashHelper.createJWT({
        //     nome: 'Random string',
        //     pass: 'pass'
        // });
        return 'Deprecated';
    }

    async createSignedJWT({ request, response }) {
        return HashHelper.hteste(
            '173013304aeec4e49cc6718cb4caeccb',
            'my.vuw.ac.nz/sda-file-association',
            '2016-01'
        );
    }

    async eth() {
        return await new Ethereum()
            .getTransaction('0x379dcaeb0a555b96fcca7c3092f51ecc1410ebf87ee48e9b6b7ddfcd6e6d7b58');
    }

    async ethTransaction({ request, response }) {
        const data = request.only(['data']);
        // return await new Ethereum()
        //     .transactionWithData(data.data);
        // return await new Ethereum().tTest(data.data);
        return await new Ethereum().getBalance('0x6637DA163590928011dd2dF2F7f34cb301799cc7');
    }

    async createEthereumAccount ({ request, response }) {
        // return await response.send({
        //     data: (new Ethereum().createAccount())
        // });
        return await new Ethereum().createAccount();
    }
}

module.exports = UserController

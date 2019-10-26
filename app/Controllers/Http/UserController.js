'use strict'

const User = use("App/Models/User");
const HashHelper = use('App/Support/HashHelper');
const FileHelper = use('App/Support/FileHelper');
const Helpers = use('Helpers');
const Ethereum = use('App/Services/Ethereum');
const ContractHelper = use('App/Support/ContractHelper');

const Ganache = use('App/Services/Ganache');

const ContractInstance = use('App/Support/ContractInstance');

const Web3 = require('web3');

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

    async contract ({ request, response }) {
        // return 111;
        return ContractHelper.readContract();
    }

    async ganacheDeployContract ({ request, response }) {
        
        const {abi, evm} = ContractHelper.readContract().contracts['Contract.sol']['Docs'];
        // console.log(abi, evm)

        const contract = new Ganache.connection.eth.Contract(abi)

        return {
            r:  await this.deployContract(contract, abi, evm),
            t: 'er'
        }

        console.log(contract);
    }

    async deployContract (contract, abi, evm) {

        const addresses= await Ganache.connection.eth.getAccounts();
        const gasPrice = await Ganache.connection.eth.getGasPrice();
        let deployAddress = null

        // Deploy the HelloWorld contract (its bytecode) 
        // by spending some gas from our first address
        contract.deploy({
            data: evm.bytecode.object,
        })
        .send({
            from: addresses[0],
            gas: 1000000,
            gasPrice,
        })
        .on('confirmation', async (confNumber, receipt) => {
            const { contractAddress } = receipt
            console.log("Deployed at", contractAddress);
            deployAddress = contractAddress;

            // Get the deployed contract instance:
            const contractInstance = new Ganache.connection.eth.Contract(abi, contractAddress);

           //static contract instance
           ContractInstance.contract = contractInstance;


           ////////////////////////////////

            // Call the "addDocument" function and log the result:
            // const doc = await contractInstance.methods.addDocument(
            //     '0x7465737400000000000000000000000000000000000000000000000000000111',
            //     '0x7465737400000000000000000000000000000000000000000000000000000222').call();
            // console.log("Result of blockchain: ", doc);
        })
        .on('error', (err) => {
            console.log("Failed to deploy:", error) 
        })
        return {
            status: 'success',
            deploy: deployAddress
        }
    }

    async docsCount () {
        return {
            size: await ContractInstance.contract.methods.getDocsCount().call()
        }
    }

    async getIdentity ({request, response }) {
        const signature = request.input('signature');
        const doc = await ContractInstance.contract.methods.getDoc(
            signature
        ).call();

        return {
            identity: doc
        }
    }

    async index ({ request, response }) {
        return response.send(await ContractInstance.contract.methods.listDocuments().call());
    }

    async create ({ request, response }) {
        const signature = request.input('signature');
        const identity = request.input('identity');

        // response.send(await ContractInstance.contract.methods.addDocument(
        //         Ganache.connection.utils.fromUtf8(signature),
        //         Ganache.connection.utils.fromUtf8(identity)
        //     ).estimateGas({gas: 6000000})
        // );

        const addresses= await Ganache.connection.eth.getAccounts();

        console.log(Ganache.connection.eth.getBlock('latest').gasLimit);


        await ContractInstance.contract.methods.addDocument(
            Ganache.connection.utils.fromUtf8(signature),
            Ganache.connection.utils.fromUtf8(identity)
        ).send({from: addresses[1]});

        response.send({
            message: 'Document added successfully'
        });
    }
}

module.exports = UserController

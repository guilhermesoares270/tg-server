'use strict'

const ContractHelper = use('App/Support/ContractHelper');
const Ganache = use('App/Services/Ganache');
const ContractInstance = use('App/Support/ContractInstance');

const jwt = require("jsonwebtoken");

class BlockchainController {

  async validateToken(request, auth) {
    const { authorization } = request.headers();
    console.log(`auth: ${authorization}`);
    if (!authorization) return false;
    return true;
  }

  async getToken(request, auth) {
    try {
      const exists = await this.validateToken(request, auth);
      console.log(`Exists: ${exists}`);
      if (!exists) return {};
      const { authorization } = request.headers();
      if (!authorization) return {};
      const token = authorization.split(" ")[1];
      console.log(`token: ${token}`);
      const payload = jwt.decode(token);
      console.log(`payload: ${JSON.stringify(payload)} - keys: ${Object.keys(payload)}`);
      return payload;
    } catch (error) {
      // console.log(`getToken: ${error}`);
      return {};
    }
  }

  async ganacheDeployContract({ request, response }) {

    const { razao_social, cnpj } = request.only(["razao_social", "cnpj"]);

    const { abi, evm } = ContractHelper.readContract().contracts['generic_contract.sol']['Docs'];

    const contract = new Ganache.connection.eth.Contract(abi);

    const deployData = {
      abi,
      evm,
      contract,
      razao_social,
      cnpj
    };

    // return await this.deployContract(contract, abi, evm);
    return await this.deployContract(deployData);
  }

  // async deployContract(contract, abi, evm) {
  async deployContract({ contract, abi, evm, razao_social, cnpj }) {
    const addresses = await Ganache.connection.eth.getAccounts();
    const gasPrice = await Ganache.connection.eth.getGasPrice();
    let deployAddress = null;

    // Deploy the HelloWorld contract (its bytecode)
    // by spending some gas from our first address
    contract.deploy({
      data: evm.bytecode.object,
      arguments: [cnpj, razao_social]
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
        // ContractInstance.contract = contractInstance;
        ContractInstance.addContract(contractInstance, razao_social, cnpj);

      })
      .on('error', (err) => {
        return {
          status: 'error',
          deploy: null
        }
      })
    return {
      status: 'success',
      deploy: deployAddress
    }
  }

  async docsCount({ request, auth }) {

    const token = await this.getToken(request, auth);
    console.log(`token: ${JSON.stringify(token)}`);
    if (Object.keys(token).length === 0) return { size: 0 };
    // return {
    //   size: await ContractInstance.contract.methods.getDocsCount().call()
    // }
    return {
      size: await ContractInstance.contract(token.razao_social).methods.getDocsCount().call()
    }
  }

  async getIdentity({ request, response }) {
    const signature = request.input('signature');
    const doc = await ContractInstance.contract.methods.getDoc(
      signature
    ).call();

    return {
      identity: doc
    }
  }

  async getEnterprise({ request }) {
    const data = await ContractInstance.contract.methods.getEnterpriseInfo().call();
    return {
      razao_social: data[0],
      cnpj: data[1]
    }
  }

  async index({ request, response }) {
    const res = await ContractInstance.contract.methods.listDocuments().call();
    const signatures = res[0];
    const identities = res[1];
    let merge = [];
    for (let i = 0; i < res[0].length; i++) {
      merge.push({
        signature: signatures[i],
        identity: identities[i]
      });
    }
    return response.send(merge);
  }

  async create({ request, response }) {
    const signature = request.input('signature');
    const identity = request.input('identity');

    const addresses = await Ganache.connection.eth.getAccounts();

    await ContractInstance.contract.methods.addDocument(
      Ganache.connection.utils.fromUtf8(signature),
      Ganache.connection.utils.fromUtf8(identity)
    ).send({ from: addresses[1] });

    response.send({
      message: 'Document added successfully',
      "signature": Ganache.connection.utils.fromUtf8(signature),
      "identity": Ganache.connection.utils.fromUtf8(identity)
    });
  }
}

module.exports = BlockchainController

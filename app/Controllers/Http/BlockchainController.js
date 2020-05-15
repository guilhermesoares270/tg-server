'use strict'

const ContractHelper = use('App/Support/ContractHelper');
const Ganache = use('App/Services/Ganache');
const ContractInstance = use('App/Support/ContractInstance');

const jwt = require("jsonwebtoken");
const jwtDecode = require('jwt-decode');

class BlockchainController {

  async validateToken(request, auth) {
    const { authorization } = request.headers();
    if (!authorization) return false;
    return true;
  }

  async getToken(request, auth) {
    try {
      const exists = await this.validateToken(request, auth);
      if (!exists) return {};
      const { authorization } = request.headers();
      if (!authorization) return {};
      const token = authorization.split(" ")[1];
      const payload = jwtDecode(token);
      return payload;
    } catch (error) {
      // console.log(`getToken: ${error}`);
      return {};
    }
  }

  async deploy(razao_social, cnpj) {
    const { abi, evm } = ContractHelper.readContract().contracts['generic_contract.sol']['Docs'];

    const contract = new Ganache.connection.eth.Contract(abi);

    const deployData = {
      abi,
      evm,
      contract,
      razao_social,
      cnpj
    };

    return await this.deployContract(deployData);
  }

  async ganacheDeployContract({ request, response }) {

    const { razao_social, cnpj } = request.only(["razao_social", "cnpj"]);

    return await this.deploy(razao_social, cnpj);
  }

  async deployContract({ contract, abi, evm, razao_social, cnpj }) {
    try {

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

    } catch (error) {
      return {
        deploy: 'failure',
      }
    }
  }

  async docsCount({ request, response, auth }) {

    const token = await this.getToken(request, auth);
    const { data: { enterprise } } = token;
    if (Object.keys(token).length === 0) return { size: 0 };
    const contractInfo = ContractInstance.contract(enterprise.razao_social);
    // return {
    //   size: parseInt(await contractInfo.contract.methods.getDocsCount().call())
    // }
    response.send({
      size: parseInt(await contractInfo.contract.methods.getDocsCount().call())
    });
  }

  async getEnterprise({ request, response, auth }) {
    try {
      const token = await this.getToken(request, auth);
      const { data: { enterprise } } = token;

      const contractInfo = ContractInstance.contract(enterprise.razao_social);
      const data = await contractInfo.contract.methods.getEnterpriseInfo().call();
      response.send({
        ...data,
        errors: [],
      });
    } catch (error) {
      console.log(`Enterprise Error: ${error}`);
      response.send({
        razao_social: null,
        cnpj: null,
        errors: [error.message]
      });
      // return {
      //   razao_social: null,
      //   cnpj: null,
      //   errors: [error.message]
      // }
    }
  }

  async index({ request, response, auth }) {
    const token = await this.getToken(request, auth);
    const { data: { enterprise } } = token;

    try {
      const contractInfo = ContractInstance.contract(enterprise.razao_social);
      if (contractInfo == null) throw Error('Contract for this enterprise not found');

      const res = await contractInfo.contract.methods.listDocuments().call();
      const signatures = res[0];
      const cpfs = res[1];

      let merge = [];
      for (let i = 0; i < res[0].length; i++) {
        merge.push({
          signature: signatures[i],
          cpf: cpfs[i]
        });
      }
      return response.send({ data: [...merge], errors: [] });
    } catch (error) {
      return response.send({ data: [], errors: error.message });
    }
  }

  async create({ request, response, auth }) {
    const token = await this.getToken(request, auth);
    const { data: { enterprise } } = token;

    try {
      const signature = request.input('signature');
      const cpf = request.input('cpf');

      const addresses = await Ganache.connection.eth.getAccounts();

      const contractInfo = ContractInstance.contract(enterprise.razao_social);

      await contractInfo.contract.methods.addDocument(
        Ganache.connection.utils.fromUtf8(signature),
        Ganache.connection.utils.fromUtf8(cpf)
      ).send({ from: addresses[1] }); //Change

      response.send({
        data: {
          message: 'Document added successfully',
          "signature": Ganache.connection.utils.fromUtf8(signature),
          "cpf": Ganache.connection.utils.fromUtf8(cpf)
        },
        errors: []
      });
    } catch (error) {
      return response.send({ data: [], errors: [error.message] });
    }
  }

  async verifyDocument({ request, response, auth }) {
    const token = await this.getToken(request, auth);
    const { data: { enterprise } } = token;

    try {
      const signature = request.input('signature');
      const contractInfo = ContractInstance.contract(enterprise.razao_social);

      const exists = await contractInfo.contract.methods.validateDocument(
        Ganache.connection.utils.fromUtf8(signature)
      ).call();

      response.send({ data: [{ exists: exists }], errors: [] });

    } catch (error) {
      response.send({ data: [], errors: [error.message] });
    }
  }

  async getDocument({ request, response, auth }) {
    const token = await this.getToken(request, auth);
    const { data: { enterprise } } = token;

    try {
      const signature = request.input('signature');
      const contractInfo = ContractInstance.contract(enterprise.razao_social);

      const cpfBytes = await contractInfo.contract.methods.getDocument(
        signature
      ).call();

      const cpf = Ganache.connection.utils.hexToUtf8(cpfBytes);
      if (cpf == '') throw Error('Identity not found');

      response.send({ data: [{ cpf: cpf }], errors: [] });

    } catch (error) {
      response.send({ data: [], errors: [error.message] });
    }
  }
}

module.exports = BlockchainController

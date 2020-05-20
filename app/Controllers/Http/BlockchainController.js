'use strict'

const ContractHelper = use('App/Support/ContractHelper');
// const Ganache = use('App/Services/Ganache');
// const Infura = use('App/Services/Infura');
const Wallet = use('App/Services/EnterpriseWallet');
const ContractInstance = use('App/Support/ContractInstance');

const jwt = require("jsonwebtoken");
const jwtDecode = require('jwt-decode');
const Enterprise = use("App/Models/Enterprise");

class BlockchainController {

  async estimate() {
    const contractInfo = ContractInstance.contract(enterprise.razao_social);
    contractInfo.contract.Contract.estimateGas();
  }

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
    const contract = new Wallet.eth.Contract(abi);

    const deployData = {
      abi,
      evm,
      contract,
      razao_social,
      cnpj
    };

    // return await this.deployContract(deployData);
    const [address, errors] = await this.deployContract(deployData);
    return {
      address,
      errors
    };
  }

  async ganacheDeployContract({ request, response }) {
    const { razao_social, cnpj } = request.only(["razao_social", "cnpj"]);
    return await this.deploy(razao_social, cnpj);
  }

  async deployContract({ contract, abi, evm, razao_social, cnpj }) {
    try {
      const accounts = await Wallet.eth.getAccounts();
      const gasPrice = await Wallet.eth.getGasPrice();

      console.log(`Attempting to deploy from account`, accounts[0]);
      const result = await contract.deploy({
        data: '0x' + evm.bytecode.object,
        arguments: [cnpj, razao_social]
      })
        .send({
          gas: 3000000,
          from: accounts[0],
          gasLimit: "3000000",
        });

      console.log(`res: ${JSON.stringify(result.options)}`);
      console.log(`Contract deployed to`, result.options.address);

      // //Save into the database
      const enterprise = await Enterprise.findBy(
        "cnpj", cnpj
      );

      if (enterprise) {
        enterprise.contract_address = result.options.address;
        await enterprise.save();
      }

      // return result.options.address;
      return [result.options.address, []]
    } catch (error) {
      console.log(error.message);
      return [null, [error.message]]
    }
  }

  async docsCount({ request, response, auth }) {
    const token = await this.getToken(request, auth);
    const { data: { enterprise } } = token;
    if (Object.keys(token).length === 0) return { size: 0 };

    try {
      const contractInfo = ContractInstance.contract(enterprise.razao_social);

      response.send({
        size: parseInt(await contractInfo.contract.methods.getDocsCount().call())
      });

    } catch (error) {
      console.log(`error: ${error.message}`);
      response.send({
        size: 0,
      });
    }
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

      const addresses = await Wallet.eth.getAccounts();
      const contractInfo = ContractInstance.contract(enterprise.razao_social);

      await contractInfo.contract.methods.addDocument(
        Wallet.utils.fromUtf8(signature),
        Wallet.utils.fromUtf8(cpf)
      ).send({ from: addresses[0] }); //Change

      response.send({
        data: {
          message: 'Document added successfully',
          "signature": Wallet.utils.fromUtf8(signature),
          "cpf": Wallet.utils.fromUtf8(cpf)
        },
        errors: []
      });
    } catch (error) {
      return response.send({ data: [], errors: [error.message] });
    }
  }

  async getDocument({ request, response, auth }) {
    const token = await this.getToken(request, auth);
    const { data: { enterprise } } = token;

    try {
      const signature = request.input('signature');
      const contractInfo = ContractInstance.contract(enterprise.razao_social);

      const cpfBytes = await contractInfo.contract.methods.getDocument(
        Wallet.utils.fromUtf8(signature)
      ).call();

      const cpf = Wallet.utils.hexToUtf8(cpfBytes);
      if (cpf == '') throw Error('CPF not found');

      response.send({ data: [{ cpf: cpf }], errors: [] });

    } catch (error) {
      response.send({ data: [], errors: [error.message] });
    }
  }
}

module.exports = BlockchainController

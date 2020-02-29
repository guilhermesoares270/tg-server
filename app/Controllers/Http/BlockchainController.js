'use strict'

const ContractHelper = use('App/Support/ContractHelper');
const Ganache = use('App/Services/Ganache');
const ContractInstance = use('App/Support/ContractInstance');

class BlockchainController {
  async ganacheDeployContract({ request, response }) {

    const { abi, evm } = ContractHelper.readContract().contracts['Contract.sol']['Docs'];

    const contract = new Ganache.connection.eth.Contract(abi)

    return await this.deployContract(contract, abi, evm);
  }

  async deployContract(contract, abi, evm) {

    const addresses = await Ganache.connection.eth.getAccounts();
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

  async docsCount() {
    return {
      size: await ContractInstance.contract.methods.getDocsCount().call()
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

  async index({ request, response }) {
    // return response.send(await ContractInstance.contract.methods.listDocuments().call());
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

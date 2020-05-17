// const { abi, evm } = ContractHelper.readContract().contracts['generic_contract.sol']['Docs'];
// const contractInstance = new Wallet.eth.Contract(abi, '0x5dbb5c21EC4bfE09fC96674a3050bAbE9FaAc222');
// const addresses = await Wallet.eth.getAccounts();
// ContractInstance.addContract(contractInstance, 'empresa1', '897975');

const ContractHelper = require('../Support/ContractHelper');
// const enterpriseModel = require('../Models/Enterprise');
const ContractInstance = require('../Support/ContractInstance');
const Wallet = require('../Services/EnterpriseWallet');
const { Pool, Client } = require('pg')

const findContracts = async () => {
  const { abi } = ContractHelper.readContract().contracts['generic_contract.sol']['Docs'];

  const query = {
    text: 'SELECT razao_social as rs, cnpj as cnpj, contract_address as ca FROM enterprises LIMIT 500',
    rowMode: 'object',
  };
  const client = new Client()
  await client.connect()
  const enterprises = await client.query(query)
  await client.end()

  enterprises.rows.forEach(x => {
    const enterpriseContract = new Wallet.eth.Contract(abi, x.ca);
    ContractInstance.addContract(enterpriseContract, x.rs, x.cnpj);
  });

  // console.log(`here: ${JSON.stringify(enterprises.rows)}`);
  // console.log(ContractInstance.contracts.length);
};

module.exports = findContracts;

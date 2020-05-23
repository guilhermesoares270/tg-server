const ContractHelper = require('../Support/ContractHelper');
const ContractInstance = require('../Support/ContractInstance');
const Wallet = require('../Services/EnterpriseWallet');
const { Client } = require('pg');
const env = require('dotenv').config();
const parse = require('pg-connection-string').parse;
var config = parse(process.env.DATABASE_URL);

const findContracts = async () => {
  const { abi } = ContractHelper.readContract().contracts['generic_contract.sol']['Docs'];

  const query = {
    text: 'SELECT razao_social as rs, cnpj as cnpj, contract_address as ca FROM enterprises LIMIT 500',
    rowMode: 'object',
  };
  const client = new Client(config)
  await client.connect()
  const enterprises = await client.query(query)
  await client.end()

  enterprises.rows.forEach(x => {
    const enterpriseContract = new Wallet.eth.Contract(abi, x.ca);
    ContractInstance.addContract(enterpriseContract, x.rs, x.cnpj);
  });
};

module.exports = findContracts;

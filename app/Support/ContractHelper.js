'use strict';

const fs = require('fs');
const solc = require('solc');
const path = require('path');

class ContractHelper {

  static readContract() {
    console.log(path.resolve('./app/Contracts/generic_contract.sol'));
    const content = fs.readFileSync(path.resolve('./app/Contracts/generic_contract.sol'), 'utf8');

    const input = {
      language: 'Solidity',
      sources: {
        'generic_contract.sol': {
          content,
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    }
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    return output;
  }
}


module.exports = ContractHelper;

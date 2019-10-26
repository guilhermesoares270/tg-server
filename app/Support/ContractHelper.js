'use strict';

const fs = require('fs');
const solc = require('solc');

class ContractHelper {

    static readContract () {
        const content = fs.readFileSync('Contract.sol', 'utf8');
    
        const input = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
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
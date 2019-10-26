'use strict';


class ContractInstance
{
    set contract (contract) {
        this.contractInstance = contract;
    }

    get contract () {
        return this.contractInstance;
    }
}

// const ci = new ContractInstance();
// ci.contract = 'abcdefghijklm';
// module.exports = ci;

module.exports = new ContractInstance();
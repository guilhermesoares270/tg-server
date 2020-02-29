'use strict';

// class ContractInstance
// {
//     set contract (contract) {
//         this.contractInstance = contract;
//     }

//     get contract () {
//         return this.contractInstance;
//     }
// }

class ContractInstance {
  contracts = [];

  contractExist(razao_social) {
    const contract = this.contract(razao_social);
    return contract !== null;
  }

  addContract(contract, razao_social, cnpj) {
    if (!this.contractExist(razao_social)) {
      this.contracts.push({
        contract,
        razao_social,
        cnpj
      });
      return true;
    }
    return false;
  }

  contract(razao_social) {
    console.log('contract');
    const contracts = this.contracts.filter(x => (x.razao_social === razao_social));
    console.log(`contracts length: ${contracts.length}`);
    if (contracts.length === 0) return null;
    return contracts[0];
  }

  // set contract({ contract, razao_social, cnpj }) {
  //   if (!this.contractExist(razao_social)) {
  //     this.contracts.push({
  //       contract,
  //       razao_social,
  //       cnpj
  //     });
  //     return true;
  //   }
  //   return false;
  // }

  // get contract(razao_social) {
  //   const contracts = this.contracts.filter(x => {
  //     return x.razao_social === input_razao_social;
  //   });
  //   if (contracts.length === 0) return null;
  //   return contracts[0];
  // }
}

module.exports = new ContractInstance();

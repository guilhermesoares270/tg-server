'use strict';

class ContractInstance {
  contracts = [];

  contractExist(razao_social) {
    const contract = this.contract(razao_social);
    return contract !== null;
  }

  addContract(contract, razao_social, cnpj) {
    console.log(`addContract`);
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
}

module.exports = new ContractInstance();

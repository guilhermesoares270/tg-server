'use strict';

const Web3 = require('web3');

/**
 * Local connection for test pourposes
 */
class Infura {

  constructor(url) {
    const provider = new Web3.providers.HttpProvider(url);
    const web3 = new Web3(provider);
    this.connection = web3;
  }
}

module.exports = new Infura('https://rinkeby.infura.io/v3/1bcd89a31fc44cda8aa518374eacb56c');

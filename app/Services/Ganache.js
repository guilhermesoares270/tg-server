'use strict';

const Web3 = require('web3');

/**
 * Local connection for test pourposes
 */
class Ganache {

    constructor(url) {
        const provider = new Web3.providers.HttpProvider(url);
        const web3 = new Web3(provider);
        this.connection = web3;
    }

    teste () {
        return 'aaa';
    }

    // connect(url) {
    //     const provider = new Web3.providers.HttpProvider(url);
    //     const web3 = new Web3(provider);
    // }
}

module.exports = new Ganache('http://127.0.0.1:8545');
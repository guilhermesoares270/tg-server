'use strict';

const Web3 = require('web3');
const fs = require('fs');
const Helpers = use('Helpers');
const EthereumTx = require('ethereumjs-tx').Transaction;

class Ethereum
{
    constructor() {
        const rcpUrl = 'https://ropsten.infura.io/v3/916ed7747dfc4fdb9d68ae6f67edb229';
        this.web3 = new Web3(new Web3.providers.HttpProvider(rcpUrl));
        console.log('Const');
    }

    async tTest (data) {
        const keystore = fs.readFileSync(`${Helpers.tmpPath()}/private.pem`);
        const decryptedAccount = this.web3.eth.accounts.decrypt(keystore, 'PASSWORD');

        let gasLimit = null;
        await this.web3.eth.getBlock('latest', false, (error, result) => {
            gasLimit = result.gasLimit;
        });

        const rawTransaction = {
            from: '0x687422eea2cb73b5d3e242ba5456b782919afc85',
            to: '0x6637DA163590928011dd2dF2F7f34cb301799cc7',
            value: '1000000000',
            gas: gasLimit,
            gasPrice: '234567897654321',
            nonce: 0,
            input: data,
            chainId: 1
        }

        decryptedAccount.signTransaction(rawTransaction)
        .then(signed => {
            this.web3.eth.sendSignedTransaction(signed.rawTransaction);
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    async createAccount () {
        // return 111;
        return await this.web3.eth.accounts.create();
    }

    async getTransaction (transactionId) {
        return await this.web3.eth.getTransaction(transactionId);
    }

    async getBalance(account) {
        let balance = 'null';
        await this.web3.eth.getBalance(account, (error, wei) => {
            balance = this.web3.utils.fromWei(wei, 'ether');
        });
        return balance;
    }

    async transactionWithData(data) {
        let res = null;

        let gasLimit = null;
        await this.web3.eth.getBlock('latest', false, (error, result) => {
            gasLimit = result.gasLimit;
        });

        // return data;
        const pk = fs.readFileSync(`${Helpers.tmpPath()}/private.txt`);
        const privateBuffer = new Buffer.from('9cc5b2673f1a5fd223e104811239f78af6d81c1e6345e5d0ad5c2004bdc333e4', 'hex');
        
        const dataBuffer = Buffer.from(data, 'utf8').toString('hex');
        const testHex = Buffer.from('aaa', 'hex');
        
        const txParams = {
            from: '0x687422eea2cb73b5d3e242ba5456b782919afc85',
            to: '0x65630100a5864fb94cd998b6d4c2ca2acba14127',
            value: '1000000000',
            gas: gasLimit,
            gasPrice: '234567897654321',
            nonce: 0,
            input: testHex,
            chainId: 1
        }

        const tx = new EthereumTx(txParams, { chain: 'ropsten', hardfork: 'petersburg'});
        tx.sign(privateBuffer);
        
        const receipt = await this.web3.eth.sendSignedTransaction('0x' + tx.raw.toString('hex'));
        return receipt;

        // await this.web3.eth.accounts.signTransaction(tx, pk)
        //     .then(signed => {
        //         this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        //         .on('receipt', console.log);
        //     });

        // await this.web3.eth.sendTransaction(tx, (error, obj) => {
        //     if(error) res = error.message;
        //     res = 'success';
        // });
        // return res;
    }
}

module.exports = Ethereum;
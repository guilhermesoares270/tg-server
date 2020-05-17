const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = 'alley village fox never just borrow begin vault naive paddle sick dice';
const instance = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/1bcd89a31fc44cda8aa518374eacb56c");
      },
      network_id: 4,
      // gas: 4500000,
      gas: 6700000,
      gasPrice: 10000000000,
    }
  }
}

const provider = instance.networks.rinkeby.provider();
const web3 = new Web3(provider);

// web3.eth.getBalance("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", function (err, result) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(web3.utils.fromWei(result, "ether") + " ETH");
//   }
// });

module.exports = web3;

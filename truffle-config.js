const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic_local = "multiply impose enough asthma chalk famous orient health people merry discover design";
module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    development: {
      provider: () => new HDWalletProvider(mnemonic_local, `http://localhost:9545`),
      host: "127.0.0.1", // Localhost (default: none)
      port: 9545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
  },
  compilers: {
    solc: {
      version: "0.7.0",
    }
  }
};

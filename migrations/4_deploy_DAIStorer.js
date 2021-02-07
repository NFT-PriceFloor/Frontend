var DAIStore = artifacts.require("./DaiStore.sol");

module.exports = function(deployer) {
  deployer.deploy(DAIStore);
};

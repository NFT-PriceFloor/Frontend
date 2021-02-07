var DAI = artifacts.require("./DAI.sol");

module.exports = function(deployer) {
  deployer.deploy(DAI);
};


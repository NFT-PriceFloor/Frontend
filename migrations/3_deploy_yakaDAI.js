var yakaDAI = artifacts.require("./yakaDAI.sol");

module.exports = function(deployer) {
  deployer.deploy(yakaDAI);
};


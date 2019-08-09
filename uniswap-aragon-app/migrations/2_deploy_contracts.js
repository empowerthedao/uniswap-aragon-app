const TestERC20 = artifacts.require('TestERC20');

module.exports = async (deployer) => {

    await deployer.deploy(TestERC20)

}

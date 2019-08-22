const BN = require('bn.js')
const UniswapExchange = artifacts.require("uniswap_exchange")
const UniswapFactory = artifacts.require("uniswap_factory")
const TestERC20 = artifacts.require('TestERC20')

const valueWithDecimals = (value) => new BN(value).mul(new BN(10).pow(new BN(18)))

// const TOKEN_SUPPLY = valueWithDecimals(1000000)
const EXCHANGE_LIQUIDITY = valueWithDecimals(5000)

module.exports = async (deployer) => {

    // Deploy Uniswap
    await deployer.deploy(UniswapExchange)
    await deployer.deploy(UniswapFactory)
    await deployer.deploy(TestERC20)

    const uniswapFactory = await UniswapFactory.at(UniswapFactory.address)
    await uniswapFactory.initializeFactory(UniswapExchange.address)

    // Create an exchange
    await uniswapFactory.createExchange(TestERC20.address)
    const exchangeAddress = await uniswapFactory.getExchange(TestERC20.address)
    console.log(`Created ERC20 exchange: ${exchangeAddress}\n`)

    // Add liquidity to exchange
    const exchange = await UniswapExchange.at(exchangeAddress)
    const erc20 = await TestERC20.at(TestERC20.address)
    await erc20.approve(exchangeAddress, TOKEN_SUPPLY)

    const blockTimestamp = (await web3.eth.getBlock('latest')).timestamp
    const futureTimestamp = blockTimestamp + 9999

    const fiveEthInWei = web3.utils.toWei('5', 'ether')
    await exchange.addLiquidity(0, EXCHANGE_LIQUIDITY, futureTimestamp, {value: fiveEthInWei})
    console.log(`Added liquidity to exchange: ${EXCHANGE_LIQUIDITY.toString()} ERC20 and ${fiveEthInWei} ETH\n`)

}
const BN = require('bn.js')

const UniswapExchange = artifacts.require("uniswap_exchange")
const UniswapFactory = artifacts.require("uniswap_factory")
const ERC20 = artifacts.require('ERC20')

const valueWithDecimals = (value) => new BN(value).mul(new BN(10).pow(new BN(18)))

const TOKEN_SUPPLY = valueWithDecimals(1000000)
const EXCHANGE_LIQUIDITY = valueWithDecimals(5000)
const PURCHASE_TOKENS = valueWithDecimals(2000)
const PURCHASE_ETH = valueWithDecimals(1)

module.exports = async (deployer, network, accounts) => {

    // Deploy Uniswap
    await deployer.deploy(UniswapExchange)
    await deployer.deploy(UniswapFactory)
    await deployer.deploy(ERC20, '0xABCD', '0xABCD', 18, TOKEN_SUPPLY)

    const uniswapFactory = await UniswapFactory.at(UniswapFactory.address)
    await uniswapFactory.initializeFactory(UniswapExchange.address)

    // Create an exchange
    await uniswapFactory.createExchange(ERC20.address)
    const exchangeAddress = await uniswapFactory.getExchange(ERC20.address)
    console.log(`ERC20 exchange address: ${exchangeAddress}\n`)

    // Add liquidity to exchange
    const exchange = await UniswapExchange.at(exchangeAddress)
    const erc20 = await ERC20.at(ERC20.address)
    await erc20.approve(exchangeAddress, TOKEN_SUPPLY)

    const blockTimestamp = (await web3.eth.getBlock('latest')).timestamp
    const futureTimestamp = blockTimestamp + 9999

    const fiveEthInWei = web3.utils.toWei('5', 'ether')
    await exchange.addLiquidity(0, EXCHANGE_LIQUIDITY, futureTimestamp, {value: fiveEthInWei})

    // Swap eth for tokens
    const tokenSwapper = accounts[1]
    const paymentEthValue = await exchange.getEthToTokenOutputPrice(PURCHASE_TOKENS)

    console.log(`Eth to tokens exchange price: ${await exchange.getEthToTokenOutputPrice(PURCHASE_TOKENS)}`)
    console.log(`Eth balance before swap: ${await web3.eth.getBalance(tokenSwapper)}`)
    console.log(`Token balance before swap: ${await erc20.balanceOf(tokenSwapper)}`)
    await exchange.ethToTokenSwapOutput(PURCHASE_TOKENS, futureTimestamp, {from: tokenSwapper, value: paymentEthValue})
    console.log(`Eth balance after swap: ${await web3.eth.getBalance(tokenSwapper)}`)
    console.log(`Token balance after swap: ${await erc20.balanceOf(tokenSwapper)}\n`)

    // Swap tokens for eth
    const paymentTokenValue = await exchange.getTokenToEthOutputPrice(PURCHASE_ETH)
    console.log(`Tokens to eth exchange price ${paymentTokenValue.toString()}`)

    console.log(`Eth balance before swap: ${await web3.eth.getBalance(tokenSwapper)}`)
    console.log(`Token balance before swap: ${await erc20.balanceOf(tokenSwapper)}`)
    await erc20.approve(exchangeAddress, TOKEN_SUPPLY, {from: tokenSwapper})
    await exchange.tokenToEthSwapOutput(PURCHASE_ETH, paymentTokenValue, futureTimestamp, {from: tokenSwapper})
    console.log(`Eth balance after swap: ${await web3.eth.getBalance(tokenSwapper)}`)
    console.log(`Token balance after swap: ${await erc20.balanceOf(tokenSwapper)}\n`)

}
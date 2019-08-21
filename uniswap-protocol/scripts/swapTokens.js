const BN = require('bn.js')
const UniswapFactory = artifacts.require("uniswap_factory")
const UniswapExchange = artifacts.require("uniswap_exchange")
const ERC20 = artifacts.require('ERC20')

const valueWithDecimals = (value) => new BN(value).mul(new BN(10).pow(new BN(18)))

const TOKEN_SUPPLY = valueWithDecimals(1000000)
const PURCHASE_TOKENS = valueWithDecimals(2000)
const PURCHASE_ETH = valueWithDecimals(1)

module.exports = async () => {

    try {
        const accounts = await web3.eth.getAccounts()
        const uniswapFactory = await UniswapFactory.at(UniswapFactory.address)
        const exchangeAddress = await uniswapFactory.getExchange(ERC20.address)
        const exchange = await UniswapExchange.at(exchangeAddress)
        const erc20 = await ERC20.at(ERC20.address)

        const blockTimestamp = (await web3.eth.getBlock('latest')).timestamp
        const futureTimestamp = blockTimestamp + 9999

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

    } catch (error) {
        console.error(error)
    }
    process.exit()
}
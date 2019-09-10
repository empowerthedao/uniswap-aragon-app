const BN = require('bn.js')
const UniswapFactory = artifacts.require("uniswap_factory")
const UniswapExchange = artifacts.require("uniswap_exchange")
const CustomERC20 = artifacts.require('CustomERC20')

const valueWithDecimals = (value) => new BN(value).mul(new BN(10).pow(new BN(18)))

const TOKEN_SUPPLY = valueWithDecimals(1000000)
const EXCHANGE_LIQUIDITY = valueWithDecimals(3000)
const NEW_TOKEN_NAME = "Basic Attention Token"
const NEW_TOKEN_SYMBOL = "BAT"

const UNISWAP_FACTORY_ADDRESS = UniswapFactory.address
// const UNISWAP_FACTORY_ADDRESS = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36'

module.exports = async () => {

    try {

        const uniswapFactory = await UniswapFactory.at(UNISWAP_FACTORY_ADDRESS)
        const newErc20 = await CustomERC20.new(NEW_TOKEN_NAME, NEW_TOKEN_SYMBOL)
        console.log(`New ERC20 ${NEW_TOKEN_NAME}: ${newErc20.address}`)

        // Create an exchange
        await uniswapFactory.createExchange(newErc20.address)
        const exchangeAddress = await uniswapFactory.getExchange(newErc20.address)
        const exchange = await UniswapExchange.at(exchangeAddress)
        console.log(`Created ERC20 exchange: ${exchangeAddress}\n`)

        // Add liquidity to exchange
        await newErc20.approve(exchangeAddress, TOKEN_SUPPLY)

        const blockTimestamp = (await web3.eth.getBlock('latest')).timestamp
        const futureTimestamp = blockTimestamp + 9999

        const fiveEthInWei = web3.utils.toWei('5', 'ether')
        await exchange.addLiquidity(0, EXCHANGE_LIQUIDITY, futureTimestamp, {value: fiveEthInWei})
        console.log(`Added liquidity to exchange: ${EXCHANGE_LIQUIDITY.toString()} ERC20 and ${fiveEthInWei} ETH\n`)


    } catch (error) {
        console.error(error)
    }
    process.exit()
}

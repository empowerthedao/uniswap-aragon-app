import BN from 'bn.js'
import {ETHER_TOKEN_FAKE_ADDRESS} from "./lib/shared-constants";

const compareBalancesByEthAndSymbol = (tokenA, tokenB) => {
    if (tokenA.address === ETHER_TOKEN_FAKE_ADDRESS) {
        return -1
    }
    if (tokenB.address === ETHER_TOKEN_FAKE_ADDRESS) {
        return 1
    }
    return tokenA.symbol.localeCompare(tokenB.symbol)
}

const reducer = state => {

    const {balances, uniswapTokens} = state || {}

    const convertedBalances = (balances || [])
        .map(balance => ({
            ...balance,
            amount: new BN(balance.amount),
            decimals: new BN(balance.decimals),

            // Note that numbers in `numData` are not safe for accurate
            // computations (but are useful for making divisions easier).
            numData: {
                amount: parseInt(balance.amount, 10),
                decimals: parseInt(balance.decimals, 10),
            },
        }))
        .sort(compareBalancesByEthAndSymbol)

    const tokens = convertedBalances.map(
        ({address, name, symbol, numData: {amount, decimals}, verified}) => ({
            address,
            amount,
            decimals,
            name,
            symbol,
            verified,
        })
    )

    const uniswapTokenInTokens = uniswapToken => tokens.find(token => token.address === uniswapToken.address)

    const mappedUniswapTokens = (uniswapTokens || [])
        .filter(uniswapToken => !uniswapTokenInTokens(uniswapToken))
        .map(({address, name, symbol, decimals, verified}) => ({
            address,
            decimals,
            name,
            symbol,
            verified,
        }))

    const tokensWithValue = convertedBalances.filter(balance => !balance.amount.isZero())

    return {
        ...state,
        // balances: convertedBalances,
        balances: convertedBalances.filter(balance => !balance.amount.isZero() || (balance.symbol === 'ETH' && tokensWithValue.length === 0)),
        tokens: [...tokens, ...mappedUniswapTokens]
    }
}

export default reducer
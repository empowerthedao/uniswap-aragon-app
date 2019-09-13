import {useAppState} from "@aragon/api-react";
import {ETH_DECIMALS} from "../lib/shared-constants";
import {formatTokenAmount} from "../lib/format-utils";
import {format} from 'date-fns'

export function useSwapState() {

    const {balances, tokenSwaps, uniswapTokens} = useAppState()

    const mappedTokenSwaps = (tokenSwaps || [])
        .map(tokenSwap => {
            const {type, input, output, timestamp, exchangeAddress} = tokenSwap
            let mappedInput, mappedOutput

            const exchangeToken = uniswapTokens.find(uniswapToken => uniswapToken.exchangeAddress === exchangeAddress) || {}

            const formattedEthAmount = (value, incoming) => formatTokenAmount(value, incoming, ETH_DECIMALS, true, {rounding: 6})
            const formattedTokenAmount = (value, incoming) => formatTokenAmount(value, incoming, exchangeToken.decimals, true, {rounding: 6})

            if (type === "ETH_TO_TOKEN") {
                mappedInput = `${formattedEthAmount(input, false)} ETH`
                mappedOutput = `${formattedTokenAmount(output, true)} ${exchangeToken.symbol}`
            } else if (type === "TOKEN_TO_ETH") {
                mappedInput = `${formattedTokenAmount(input, false)} ${exchangeToken.symbol}`
                mappedOutput = `${formattedEthAmount(output, true)} ETH`
            }

            const mappedTimestamp = format(timestamp * 1000, 'MMMM do, h:mma')

            return {
                ...tokenSwap,
                dataViewFormat: [mappedInput, mappedOutput, mappedTimestamp]
            }
        })
        .sort((x, y) => y.timestamp - x.timestamp)


    return {
        balances,
        tokenSwaps: mappedTokenSwaps
    }
}
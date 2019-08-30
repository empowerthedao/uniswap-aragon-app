import {useApi, useAppState} from "@aragon/api-react";
import {fromDecimals} from "../lib/math-utils";
import {ETH_DECIMALS} from "../lib/shared-constants";

export function useSwapState() {

    const api = useApi()
    const { tokenSwaps, uniswapTokens } = useAppState()

    console.log("Token Swaps", tokenSwaps)
    console.log("Uniswap Tokens", uniswapTokens)
    // {
    //     type: type,
    //     input: input,
    //     output: output,
    //     timestamp: eventBlock.timestamp,
    //     exchangeAddress: address
    // }

    const mappedTokenSwaps = (tokenSwaps || []).map(tokenSwap => {
        const { type, input, output, exchangeAddress } = tokenSwap
        let mappedInput, mappedOutput



        if (type === "ETH_TO_TOKEN") {
            mappedInput = fromDecimals(input, ETH_DECIMALS)
        } else if (type === "TOKEN_TO_ETH") {
            mappedOutput = fromDecimals(output, ETH_DECIMALS)
        }

        return {
            ...tokenSwap,
            input: mappedInput,
            output: mappedOutput
        }
    })


    return {
        tokenSwaps: mappedTokenSwaps
    }
}
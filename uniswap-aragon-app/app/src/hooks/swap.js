import {useCallback} from 'react'
import {useApi, useAppState} from "@aragon/api-react";
import {ETHER_TOKEN_FAKE_ADDRESS, ETH_DECIMALS} from "../lib/shared-constants";
import {uniswapExchangeFromToken$} from "../web3/ExternalContracts";
import {mergeMap, tap} from "rxjs/operators";
import {fromDecimals, toDecimals} from "../lib/math-utils";

const useGetTokensForEthExchangeRate = () => {
    const api = useApi()

    return useCallback((token, ethAmount, onDone) => {

        if (ethAmount === "" || ethAmount === "0") {
            return
        }

        const adjustedEthAmount = toDecimals(ethAmount, ETH_DECIMALS)
        uniswapExchangeFromToken$(api, token.address).pipe(
            tap(console.log),
            mergeMap(uniswapExchange => uniswapExchange.getEthToTokenInputPrice(adjustedEthAmount)), tap(console.log))
            .subscribe(exchangeRate => {
                const adjustedExchangeRate = fromDecimals(exchangeRate, parseInt(token.decimals))
                onDone(adjustedExchangeRate)
            })
    }, [api])
}

export function useSwapPanelState() {
    const {uniswapTokens, tokens} = useAppState()

    const ethToken = tokens.find(token => token.address === ETHER_TOKEN_FAKE_ADDRESS)

    const uniswapTokensWithEth = ethToken ? [ethToken, ...(uniswapTokens || [])] : uniswapTokens || []

    return {
        uniswapTokens: uniswapTokensWithEth,
        getTokensForEthExchangeRate: useGetTokensForEthExchangeRate()
    }
}
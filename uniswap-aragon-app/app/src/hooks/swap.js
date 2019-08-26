import {useCallback} from 'react'
import {useApi, useAppState} from "@aragon/api-react";
import {ETHER_TOKEN_FAKE_ADDRESS, ETH_DECIMALS} from "../lib/shared-constants";
import {uniswapExchangeFromToken$} from "../web3/ExternalContracts";
import {mergeMap, tap} from "rxjs/operators";
import {fromDecimals, toDecimals} from "../lib/math-utils";
import BN from "bn.js"

const useGetTokensForEthExchangeRate = () => {
    const api = useApi()

    return useCallback((token, ethAmount, onDone) => {

        if (ethAmount === "" || parseFloat(ethAmount) === 0) {
            return
        }

        const adjustedEthAmount = toDecimals(ethAmount, ETH_DECIMALS)
        uniswapExchangeFromToken$(api, token.address).pipe(
            mergeMap(uniswapExchange => uniswapExchange.getEthToTokenInputPrice(adjustedEthAmount)))
            .subscribe(exchangeRate => {
                const adjustedExchangeRate = fromDecimals(exchangeRate, parseInt(token.decimals))
                onDone(adjustedExchangeRate)
            })
    }, [api])
}

export function useSwapPanelState() {
    const {uniswapTokens, tokens} = useAppState()

    const uniswapTokensMapped = (uniswapTokens || []).map(token => ({...token, decimals: new BN(token.decimals)}))

    const ethToken = tokens.find(token => token.address === ETHER_TOKEN_FAKE_ADDRESS)
    const uniswapTokensWithEth = ethToken ? [ethToken, ...(uniswapTokensMapped || [])] : uniswapTokensMapped || []

    return {
        uniswapTokens: uniswapTokensWithEth,
        getTokensForEthExchangeRate: useGetTokensForEthExchangeRate()
    }
}
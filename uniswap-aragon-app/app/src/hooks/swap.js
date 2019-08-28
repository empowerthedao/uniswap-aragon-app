import {useCallback} from 'react'
import {useApi, useAppState} from "@aragon/api-react";
import {ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";
import {uniswapExchangeFromToken$} from "../web3/ExternalContracts";
import {mergeMap, map, tap} from "rxjs/operators";
import {fromDecimals, toDecimals} from "../lib/math-utils";
import BN from 'bn.js'

const useGetTokensEthExchangeRate = () => {
    const api = useApi()

    return useCallback((inputToken, inputAmount, outputToken, exchangeRateCallback) => {

        if (inputAmount === "" || parseFloat(inputAmount) === 0 || !inputToken || !outputToken) {
            return
        }

        const adjustedInputAmount = toDecimals(inputAmount, inputToken.decimals)

        const mapExchangeRate = exchangeRate => {
            const exchangeRateBN = new BN(exchangeRate)
            const slippageReducedExchangeRate = exchangeRateBN.mul(new BN('99')).div(new BN('100')) // Reduced by 1%
            return fromDecimals(slippageReducedExchangeRate.toString(), parseInt(outputToken.decimals))
        }

        if (inputToken.address === ETHER_TOKEN_FAKE_ADDRESS && outputToken.address !== ETHER_TOKEN_FAKE_ADDRESS) {
            uniswapExchangeFromToken$(api, outputToken.address).pipe(
                mergeMap(uniswapExchange => uniswapExchange.getEthToTokenInputPrice(adjustedInputAmount)),
                map(mapExchangeRate))
                .subscribe(adjustedExchangeRate => {
                    exchangeRateCallback(adjustedExchangeRate)
                })

        } else if (inputToken.address !== ETHER_TOKEN_FAKE_ADDRESS && outputToken.address === ETHER_TOKEN_FAKE_ADDRESS) {
            uniswapExchangeFromToken$(api, inputToken.address).pipe(
                mergeMap(uniswapExchange => uniswapExchange.getTokenToEthInputPrice(adjustedInputAmount)),
                map(mapExchangeRate))
                .subscribe(exchangeRate => {
                    exchangeRateCallback(exchangeRate)
                })
        }

    }, [api])
}

export function useSwapPanelState() {
    const {uniswapTokens, tokens} = useAppState()

    const uniswapTokensMapped = (uniswapTokens || []).map(token => ({...token, decimals: parseInt(token.decimals)}))

    const ethToken = tokens.find(token => token.address === ETHER_TOKEN_FAKE_ADDRESS)
    const uniswapTokensWithEth = ethToken ? [ethToken, ...(uniswapTokensMapped || [])] : uniswapTokensMapped || []

    return {
        uniswapTokens: uniswapTokensWithEth,
        getTokensEthExchangeRate: useGetTokensEthExchangeRate()
    }
}
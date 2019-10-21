import {useCallback} from 'react'
import {useApi, useAragonApi, useAppState} from "@aragon/api-react";
import {tokenContract$} from "../web3/ExternalContracts";
import {mergeMap, map} from "rxjs/operators";
import {toDecimals} from "../lib/math-utils";
import {zip} from "rxjs";
import BN from 'bn.js'
import {isAddress} from "../lib/web3-utils"
import {ETH_DECIMALS, ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";

const checkBalanceAvailable = (api, account, token, amount, setBalanceAvailable) => {

    if (!isAddress(token) || !isAddress(account)) {
        setBalanceAvailable(true)
        return
    }

    if (token === ETHER_TOKEN_FAKE_ADDRESS) {
        api.web3Eth('getBalance', account).pipe(
            map(userBalance => {
                const adjustedAmount = toDecimals(amount.toString(), ETH_DECIMALS)
                const adjustedAmountBn = new BN(adjustedAmount)
                return adjustedAmountBn.lte(new BN(userBalance))
            })
        ).subscribe(setBalanceAvailable)
    } else {
        const adjustedAmountBn$ = token => token.decimals().pipe(
            map(decimals => toDecimals(amount.toString(), parseInt(decimals))),
            map(adjustedAmount => new BN(adjustedAmount)))

        tokenContract$(api, token).pipe(
            mergeMap(token => zip(adjustedAmountBn$(token), token.balanceOf(account))),
            map(([adjustedAmountBn, userBalance]) => adjustedAmountBn.lte(new BN(userBalance)))
        ).subscribe(setBalanceAvailable)
    }
}

const useCheckConnectedAccountBalance = () => {
    const api = useApi()
    const { connectedAccount } = useAragonApi()

    return useCallback((token, amount, setBalanceAvailable) => {
        checkBalanceAvailable(api, connectedAccount, token, amount, setBalanceAvailable)
    }, [api, connectedAccount])
}

const useTransferState = () => {

    const { tokens, balances } = useAppState()

    return {
        tokens,
        balances,
        checkConnectedAccountBalance: useCheckConnectedAccountBalance()
    }
}

export {
    useTransferState
}
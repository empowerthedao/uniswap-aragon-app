import {zip, from} from 'rxjs'
import {mergeMap, map, tap, merge, toArray, first} from "rxjs/operators";
import {agentAddress$, agentApp$, tokenContract$} from "./ExternalContracts";
import {ETHER_TOKEN_FAKE_ADDRESS, ETH_DECIMALS} from "../lib/shared-constants";
import {onErrorReturnDefault} from "../lib/rx-error-operators";
import {isTokenVerified$} from "./TokenVerification";

const agentInitializationBlock$ = (api) =>
    agentApp$(api).pipe(
        mergeMap(agent => agent.getInitializationBlock())
    )

const agentEthBalance$ = api => {

    const balanceObject = (balance) => ({
        decimals: ETH_DECIMALS.toString(),
        name: "Ether",
        symbol: "ETH",
        address: ETHER_TOKEN_FAKE_ADDRESS,
        amount: balance,
        verified: true,
    })

    return agentApp$(api).pipe(
        mergeMap(agentApp => agentApp.balance(ETHER_TOKEN_FAKE_ADDRESS)),
        map(balance => balanceObject(balance)),
        onErrorReturnDefault('agentEthBalance', balanceObject(0))
    )
}

const agentTokenBalance$ = (api, tokenAddress) => {

    const balanceObject = (decimals, name, symbol, address, balance, isTokenVerified) => ({
        decimals: decimals,
        name: name,
        symbol: symbol,
        address: address,
        amount: balance,
        verified: isTokenVerified,
    })

    return zip(agentAddress$(api), tokenContract$(api, tokenAddress)).pipe(
        mergeMap(([agentAddress, token]) =>
            zip(token.decimals(), token.name(), token.symbol(), token.balanceOf(agentAddress), isTokenVerified$(api, tokenAddress))),
        map(([decimals, name, symbol, balance, tokenVerified]) => balanceObject(decimals, name, symbol, tokenAddress, balance, tokenVerified)),
        onErrorReturnDefault(`agentTokenBalance:${tokenAddress}`, balanceObject(0, "", "", "", 0, false))
    )
}

const agentTokenBalances$ = (api, tokenAddresses) =>
    from(tokenAddresses).pipe(
        mergeMap(tokenAddress => agentTokenBalance$(api, tokenAddress)))

const agentBalances$ = (api, tokenAddresses) =>
    agentEthBalance$(api).pipe(
        merge(agentTokenBalances$(api, tokenAddresses)),
        toArray(),
        onErrorReturnDefault('agentBalances', []))

export {
    agentInitializationBlock$,
    agentBalances$,
}
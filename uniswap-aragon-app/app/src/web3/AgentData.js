import {zip, from} from 'rxjs'
import {mergeMap, map, tap, merge, toArray, first} from "rxjs/operators";
import {agentAddress$, agentApp$, tokenContract$} from "./ExternalContracts";
import {ETHER_TOKEN_FAKE_ADDRESS, ETH_DECIMALS} from "../lib/shared-constants";
import {onErrorReturnDefault} from "../lib/rx-error-operators";
import {isTokenVerified$} from "./TokenVerification";
import { ETHER_TOKEN_VERIFIED_BY_SYMBOL } from "../lib/verified-tokens"
import { utils } from "ethers"

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

    const balanceObject = (decimals, name, symbol, address, balance, isTokenVerified) => {

        if (address.toLowerCase() === ETHER_TOKEN_VERIFIED_BY_SYMBOL.get("DAI")) {
            symbol = utils.parseBytes32String(symbol)
            name = utils.parseBytes32String(name)
        }

        return {
            decimals: decimals,
            name: name,
            symbol: symbol,
            address: address,
            amount: balance,
            verified: isTokenVerified,
        }
    }

    return zip(agentAddress$(api), tokenContract$(api, tokenAddress)).pipe(
        mergeMap(([agentAddress, token]) =>
            zip(token.decimals(), token.name(), token.symbol(), token.balanceOf(agentAddress), isTokenVerified$(api, tokenAddress))),
        map(([decimals, name, symbol, balance, tokenVerified]) => balanceObject(decimals, name, symbol, tokenAddress, balance, tokenVerified)),
        onErrorReturnDefault(`agentTokenBalance:${tokenAddress}`, balanceObject(0, "", "", "", 0, false))
    )
}

// Always fetch the token balances of the Uniswap tokens available.
// const uniswapTokenAddresses$ = (api) =>
//     compoundTokenAddresses$(api).pipe(
//         concatMap(address => address),
//         mergeMap(compoundTokenAddress => compoundToken$(api, compoundTokenAddress)),
//         mergeMap(compoundToken => compoundToken.underlying()))

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
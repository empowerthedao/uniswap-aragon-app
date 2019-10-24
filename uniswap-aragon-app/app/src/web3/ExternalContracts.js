import AgentAbi from '../abi/agent-abi'
import ProxyDepositEvent from '../abi/proxy-deposit-event'
import ERC20Abi from '../abi/erc20-abi'
import UniswapExchangeAbi from '../abi/uniswap-exchange-abi'
import UniswapFactoryAbi from '../abi/uniswap-factory-abi'
import {of} from 'rxjs'
import {concatMap, map, mergeMap, toArray} from 'rxjs/operators'
import { convertToDaiErc20Abi } from "../lib/abi-utils"
import { ETHER_TOKEN_VERIFIED_BY_SYMBOL } from "../lib/verified-tokens"

const agentAddress$ = api => api.call('agent')

const uniswapFactoryAddress$ = api => api.call('uniswapFactory')

const enabledTokensAddresses$ = api => api.call('getEnabledTokens')

const agentApp$ = (api) => {
    const agentProxyDepositAbi = AgentAbi.concat([ProxyDepositEvent])
    return agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, agentProxyDepositAbi)))
}

const tokenContract$ = (api, tokenAddress) => {
    if (tokenAddress.toLowerCase() === ETHER_TOKEN_VERIFIED_BY_SYMBOL.get("DAI")) {
        return of(api.external(tokenAddress, convertToDaiErc20Abi(ERC20Abi)))
    } else {
        return of(api.external(tokenAddress, ERC20Abi))
    }
}

const uniswapFactory$ = api =>
    uniswapFactoryAddress$(api).pipe(
        map(uniswapFactoryAddress => api.external(uniswapFactoryAddress, UniswapFactoryAbi)))

const uniswapExchangeAddressFromToken$ = (api, tokenAddress) =>
    uniswapFactory$(api).pipe(
        mergeMap(uniswapFactory => uniswapFactory.getExchange(tokenAddress)))

const uniswapExchangeFromToken$ = (api, tokenAddress) =>
    uniswapExchangeAddressFromToken$(api, tokenAddress).pipe(
        map(exchangeAddress => api.external(exchangeAddress, UniswapExchangeAbi)))

const allEnabledTokensExchanges$ = api =>
    enabledTokensAddresses$(api).pipe(
        concatMap(address => address),
        mergeMap(address => uniswapExchangeFromToken$(api, address)),
        map(uniswapExchange => ({contract: uniswapExchange})),
        toArray())

export {
    agentAddress$,
    uniswapFactoryAddress$,
    enabledTokensAddresses$,
    agentApp$,
    tokenContract$,
    uniswapFactory$,
    uniswapExchangeAddressFromToken$,
    uniswapExchangeFromToken$,
    allEnabledTokensExchanges$
}
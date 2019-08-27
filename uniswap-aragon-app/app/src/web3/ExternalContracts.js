import AgentAbi from '../abi/agent-abi'
import ProxyDepositEvent from '../abi/proxy-deposit-event'
import ERC20Abi from '../abi/erc20-abi'
import UniswapExchangeAbi from '../abi/uniswap-exchange-abi'
import UniswapFactoryAbi from '../abi/uniswap-factory-abi'
import {of} from 'rxjs'
import {map, mergeMap} from 'rxjs/operators'

const agentAddress$ = api => api.call('agent')

const uniswapFactoryAddress$ = api => api.call('uniswapFactory')

const agentApp$ = (api) => {
    const agentProxyDepositAbi = AgentAbi.concat([ProxyDepositEvent])
    return agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, agentProxyDepositAbi)))
}

const tokenContract$ = (api, tokenAddress) => of(api.external(tokenAddress, ERC20Abi))

const uniswapFactory$ = api =>
    uniswapFactoryAddress$(api).pipe(
        map(uniswapFactoryAddress => api.external(uniswapFactoryAddress, UniswapFactoryAbi)))

const uniswapExchange$ = (api, exchangeAddress) => of(api.external(exchangeAddress, UniswapExchangeAbi))

const uniswapExchangeFromToken$ = (api, tokenAddress) =>
    uniswapFactory$(api).pipe(
        mergeMap(uniswapFactory => uniswapFactory.getExchange(tokenAddress)),
        map(exchangeAddress => api.external(exchangeAddress, UniswapExchangeAbi)))

export {
    agentAddress$,
    uniswapFactoryAddress$,
    agentApp$,
    tokenContract$,
    uniswapFactory$,
    uniswapExchangeFromToken$
}
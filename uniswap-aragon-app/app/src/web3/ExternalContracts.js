import AgentAbi from '../abi/agent-abi'
import ProxyDepositEvent from '../abi/proxy-deposit-event'
import ERC20Abi from '../abi/erc20-abi'
import {of} from 'rxjs'
import {map} from 'rxjs/operators'

const agentAddress$ = api => api.call('agent')

const agentApp$ = (api) => {
    const agentProxyDepositAbi = AgentAbi.concat([ProxyDepositEvent])
    return agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, agentProxyDepositAbi)))
}

const tokenContract$ = (api, tokenAddress) => of(api.external(tokenAddress, ERC20Abi))

export {
    agentAddress$,
    agentApp$,
    tokenContract$
}
import '@babel/polyfill'
import Aragon, {events} from '@aragon/api'
import retryEvery from "./lib/retry-every"
import {agentAddress$, agentApp$} from "./web3/ExternalContracts";
import {agentInitializationBlock$, agentBalances$} from "./web3/ExternalData";
import {first} from 'rxjs/operators'
import {ETHER_TOKEN_FAKE_ADDRESS} from "./lib/shared-constants";

const DEBUG_LOGS = true;
const debugLog = message => {
    if (DEBUG_LOGS) {
        console.debug(message)
    }
}

const activeTokens = state => state ? state.activeTokens ? state.activeTokens : [] : []

const api = new Aragon()

// Wait until we can get the agent address (demonstrating we are connected to the app) before initializing the store.
retryEvery(retry => {
    agentAddress$(api).subscribe(
        () => initialize(),
        error => {
            console.error(
                'Could not start background script execution due to the contract not loading the agent address:',
                error
            )
            retry()
        }
    )
})

async function initialize() {
    api.store(onNewEventCatchError, {
        init: initialState,
        externals: [
            {
                contract: await agentApp$(api).toPromise(),
                initializationBlock: await agentInitializationBlock$(api).toPromise()
            }
        ]
    })
}

const initialState = async (cachedInitState) => {
    try {
        const cachedState = await api.state().pipe(first()).toPromise()
        return {
            ...cachedInitState,
            isSyncing: true,
            agentAddress: await agentAddress$(api).toPromise(),
            balances: await agentBalances$(api, activeTokens(cachedInitState)).toPromise()
        }
    } catch (e) {
        console.error(e)
        return state
    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Script error: ${error}`)
    }
}

const onNewEvent = async (state, storeEvent) => {

    const {event: eventName, address: eventAddress} = storeEvent

    // console.log("Store Event:")
    // console.log(storeEvent)

    // console.log("Current state:")
    // console.log(state)

    switch (eventName) {
        case events.SYNC_STATUS_SYNCING:
            debugLog("APP SYNCING")
            return {
                ...state,
                isSyncing: true
            }
        case events.SYNC_STATUS_SYNCED:
            debugLog("APP DONE SYNCING")
            return {
                ...state,
                isSyncing: false
            }
        case 'AppInitialized':
            debugLog("APP CONSTRUCTOR EVENT")
            api.identify(`Agent App: ${eventAddress}`)
            return {
                ...state,
                appAddress: eventAddress
            }
        case 'NewAgentSet':
            debugLog("NEW AGENT SET")
            return {
                ...state,
                agentAddress: await agentAddress$(api).toPromise()
            }
        case 'VaultTransfer':
        case 'VaultDeposit':
            debugLog("AGENT TRANSFER")
            let newActiveTokens = [...state.activeTokens ? state.activeTokens : []]
            if (storeEvent.returnValues.token !== ETHER_TOKEN_FAKE_ADDRESS) {
                newActiveTokens.push(storeEvent.returnValues.token)
            }
            newActiveTokens = [...new Set(newActiveTokens)]
            return {
                ...state,
                balances: await agentBalances$(api, newActiveTokens).toPromise(),
                activeTokens: newActiveTokens
            }
        case 'ProxyDeposit':
            debugLog("ETH DEPOSIT")
            return {
                ...state,
                balances: await agentBalances$(api, activeTokens(state)).toPromise()
            }
        default:
            return state
    }
}
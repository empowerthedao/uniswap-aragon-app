import {deposit, ethToTokenSwapInput, setAgent, withdraw} from "../web3/UniswapContract";
import {useApi, useAppState} from "@aragon/api-react";
import {useCallback} from 'react'
import {useSidePanel} from "./side-panels";
import {useTabs} from "./tabs";
import {useSwapPanelState} from "./swap";

const useSetAgentAddress = (onDone) => {
    const api = useApi()

    return useCallback(address => {
        setAgent(api, address)
        onDone()
    }, [api, onDone])
}

const useDeposit = (onDone) => {
    const api = useApi()

    return useCallback((token, amount, decimals) => {
        deposit(api, token, amount, decimals)
        onDone()
    }, [api, onDone])
}

const useWithdraw = (onDone) => {
    const api = useApi()

    return useCallback((token, recipient, amount, decimals) => {
        withdraw(api, token, recipient, amount, decimals)
        onDone()
    }, [api, onDone])
}

// TODO: ADD ON DONE!!!
const useEthToTokenSwapInput = () => {
    const api = useApi()

    return useCallback(() => {
        ethToTokenSwapInput(api)
    }, [api])
}

export function useAppLogic() {
    const {
        isSyncing,
        tokens,
        appAddress,
        agentAddress,
        balances
    } = useAppState()

    const swapPanelState = useSwapPanelState()
    const settings = {appAddress, agentAddress}

    const sidePanel = useSidePanel()
    const tabs = useTabs()

    const actions = {
        setAgentAddress: useSetAgentAddress(sidePanel.requestClose),
        deposit: useDeposit(sidePanel.requestClose),
        withdraw: useWithdraw(sidePanel.requestClose),
        ethToTokenSwapInput: useEthToTokenSwapInput()
    }

    return {
        isSyncing,
        balances,
        tokens,
        swapPanelState,
        settings,
        actions,
        sidePanel,
        tabs
    }
}
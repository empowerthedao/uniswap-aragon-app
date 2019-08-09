import {deposit, setAgent, withdraw} from "../web3/UniswapAppContract";
import {useApi, useAppState} from "@aragon/api-react";
import {useCallback} from 'react'
import {useSidePanel} from "./side-panels";
import {useTabs} from "./tabs";
import {useSwapState} from "./swap";

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

export function useAppLogic() {
    const {
        isSyncing,
        tokens,
        appAddress,
        agentAddress,
    } = useAppState()

    const swapState = useSwapState()
    const settings = {appAddress, agentAddress}

    const sidePanel = useSidePanel()
    const tabs = useTabs()

    const actions = {
        setAgentAddress: useSetAgentAddress(sidePanel.requestClose),
        deposit: useDeposit(sidePanel.requestClose),
        withdraw: useWithdraw(sidePanel.requestClose)
    }

    return {
        isSyncing,
        swapState,
        tokens,
        settings,
        actions,
        sidePanel,
        tabs
    }
}
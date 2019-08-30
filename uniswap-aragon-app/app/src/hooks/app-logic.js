import {deposit, ethToTokenSwapInput, setAgent, setUniswapFactory, withdraw} from "../web3/UniswapContract";
import {useApi, useAppState} from "@aragon/api-react";
import {useCallback} from 'react'
import {useSidePanel} from "./side-panels";
import {useTabs} from "./tabs";
import {useSwapPanelState} from "./swap-panel";
import {useSwapState} from "./swap";

const useSetAgentAddress = (onDone) => {
    const api = useApi()

    return useCallback(address => {
        setAgent(api, address)
        onDone()
    }, [api, onDone])
}

const useSetUniswapFactoryAddress = (onDone)=> {
    const api = useApi()

    return useCallback(address => {
        setUniswapFactory(api, address)
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

const useEthToTokenSwapInput = (onDone) => {
    const api = useApi()

    return useCallback((inputToken, inputAmount, outputToken, minOutputAmount) => {
        ethToTokenSwapInput(api, inputToken, inputAmount, outputToken, minOutputAmount)
        onDone()
    }, [api])
}

export function useAppLogic() {
    const {
        isSyncing,
        tokens,
        agentAddress,
        balances,
        uniswapFactoryAddress
    } = useAppState()

    const swapState = useSwapState()
    const swapPanelState = useSwapPanelState()
    const settings = {agentAddress, uniswapFactoryAddress}

    const sidePanel = useSidePanel()
    const tabs = useTabs()

    const actions = {
        setAgentAddress: useSetAgentAddress(sidePanel.requestClose),
        setUniswapFactoryAddress: useSetUniswapFactoryAddress(sidePanel.requestClose),
        deposit: useDeposit(sidePanel.requestClose),
        withdraw: useWithdraw(sidePanel.requestClose),
        ethToTokenSwapInput: useEthToTokenSwapInput(sidePanel.requestClose)
    }

    return {
        isSyncing,
        balances,
        tokens,
        swapState,
        swapPanelState,
        settings,
        actions,
        sidePanel,
        tabs
    }
}
import React from 'react'
import {
    SidePanel,
    SyncIndicator,
    useViewport,
    Button,
    Header,
    Tabs
} from '@aragon/ui'
import Settings from "./components/settings/Settings"
import GenericInputPanel from "./components/GenericInputPanel";
import TransferPanel from "./components/balances/side-panel-input/TransferPanel";
import {useAppLogic} from "./hooks/app-logic";
import SwapIcon from "./assets/swap-icon.svg"
import PropTypes from 'prop-types';
import Swap from "./components/swap/Swap";
import SwapPanel from "./components/swap/side-panel-input/SwapPanel";

function App({compactMode}) {

    const {
        isSyncing,
        tokens,
        balances,
        swapState,
        swapPanelState,
        settings,
        actions,
        sidePanel,
        tabs
    } = useAppLogic()

    const selectedTabComponent = () => {
        switch (tabs.tabBarSelected.id) {
            case 'SWAP':
                return <Swap compactMode={compactMode}
                             balances={balances}
                             swapState={swapState}
                             handleTransfer={() => sidePanel.openPanelActions.transfer()}/>
            case 'SETTINGS':
                return <Settings settings={settings}
                                 handleNewAgent={() => sidePanel.openPanelActions.changeAgent()}
                                 handleNewUniswapFactory={() => sidePanel.openPanelActions.changeUniswapFactory()}
                                 compactMode={compactMode}/>
            default:
                return <div/>
        }
    }

    const currentSidePanel = () => {
        switch (sidePanel.currentSidePanel.id) {
            case 'TRANSFER':
                return <TransferPanel tokens={tokens}
                                      opened={sidePanel.opened}
                                      handleDeposit={actions.deposit}
                                      handleWithdraw={actions.withdraw}/>
            case 'SWAP':
                return <SwapPanel swapPanelState={swapPanelState}
                                  handleSwap={actions.ethToTokenSwapInput}/>
            case 'CHANGE_AGENT':
                return <GenericInputPanel actionTitle={'Uniswap Action'}
                                          actionDescription={`This action will change the Agent which represents an Externally
                                        Owned Account (EOA) and is responsible for interacting with the Uniswap protocol.`}
                                          inputFieldList={[
                                              {id: 1, label: 'address', type: 'text'}]}
                                          submitLabel={'Change agent'}
                                          handleSubmit={actions.setAgentAddress}/>
            case 'CHANGE_UNISWAP_FACTORY':
                return <GenericInputPanel actionTitle={'Uniswap Action'}
                                          actionDescription={`This action will change the Uniswap Factory which maintains
                                           the addresses of the individual Uniswap token exchanges.`}
                                          inputFieldList={[
                                              {id: 1, label: 'address', type: 'text'}]}
                                          submitLabel={'Change uniswap factory'}
                                          handleSubmit={actions.setUniswapFactoryAddress}/>
            default:
                return <div/>
        }
    }

    return (
        <div css="min-width: 320px">
            <SyncIndicator visible={isSyncing}/>

            <Header
                primary="Uniswap"
                secondary={
                    tabs.tabBarSelected.id === 'SWAP' &&
                    <Button
                        mode="strong"
                        onClick={() => sidePanel.openPanelActions.swap()}
                        css={`${compactMode && `
                            min-width: 40px;
                            padding: 0;
                            `}
                        `}
                    >
                        {compactMode ? <img src={SwapIcon} height="30px" alt=""/> : 'Swap Eth / Tokens'}
                    </Button>
                }
            />

            <Tabs
                items={tabs.names}
                selected={tabs.selected}
                onChange={tabs.selectTab}/>

            {selectedTabComponent()}

            <SidePanel
                title={sidePanel.currentSidePanel.title}
                opened={sidePanel.visible}
                onClose={sidePanel.requestClose}
                onTransitionEnd={sidePanel.endTransition}
            >
                {currentSidePanel()}
            </SidePanel>
        </div>
    )
}

export default () => {
    const {below} = useViewport()
    const compactMode = below('medium')

    return <App compactMode={compactMode}/>
}

App.propTypes = {
    api: PropTypes.object,
    compactMode: PropTypes.bool
}
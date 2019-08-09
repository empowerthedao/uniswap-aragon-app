import React from 'react'
import {Main, TabBar, SidePanel, SyncIndicator} from '@aragon/ui'

import AppLayout from "./components/app-layout/AppLayout"
import Settings from "./components/settings/Settings"
import Swap from "./components/swap/Swap";
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";
import TransferPanel from "./components/side-panel-input/transfer/TransferPanel";
import {useAppLogic} from "./hooks/app-logic";

function App() {

    const {
        appState,
        isSyncing,
        actions,
        sidePanel,
        tabs
    } = useAppLogic()

    const selectedTabComponent = () => {
        switch (tabs.tabBarSelected.id) {
            case 'SWAP':
                return  <Swap appState={appState} handleTransfer={() => sidePanel.openPanelActions.transfer()}/>
            case 'SETTINGS':
                return <Settings appState={appState}
                          handleNewAgent={() => sidePanel.openPanelActions.changeAgent()}/>
            default:
                return <div/>
        }
    }

    const currentSidePanel = () => {
        switch (sidePanel.currentSidePanel.id) {
            case 'CHANGE_AGENT':
                return <GenericInputPanel actionTitle={'Uniswap Action'}
                                           actionDescription={`This action will change the Agent which represents an Externally
                                        Owned Account (EOA) and is responsible for interacting with the Uniswap protocol.`}
                                           inputFieldList={[
                                               {id: 1, label: 'address', type: 'text'}]}
                                           submitLabel={'Change agent'}
                                           handleSubmit={actions.setAgentAddress}/>
            case 'TRANSFER':
                return <TransferPanel appState={appState}
                                       handleDeposit={actions.deposit}
                                       handleWithdraw={actions.withdraw}/>
            default:
                return <div/>
        }
    }

    return (
        <div css="min-width: 320px">
            <Main>
                <SyncIndicator visible={isSyncing}/>

                <AppLayout title='Uniswap'
                           tabs={(<TabBar
                               items={tabs.names}
                               selected={tabs.selected}
                               onChange={tabs.selectTab}/>)}
                           smallViewPadding={tabs.tabBarSelected.smallViewPadding}>

                    {selectedTabComponent()}

                </AppLayout>

                <SidePanel
                    title={sidePanel.currentSidePanel.title}
                    opened={sidePanel.visible}
                    onClose={sidePanel.requestClose}
                    onTransitionEnd={sidePanel.endTransition}
                >
                    {currentSidePanel()}
                </SidePanel>


            </Main>
        </div>
    )
}

export default App

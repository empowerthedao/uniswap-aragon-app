import React, {useMemo, useState} from 'react'
import styled from 'styled-components'
import {TabBar} from '@aragon/ui'

import Deposit from './Deposit'
import Withdraw from './Withdraw'

const TransferPanel = ({tokens, handleDeposit, handleWithdraw, opened}) => {

    const [screenIndex, setScreenIndex] = useState(0)

    useMemo(() => {
        if (!opened) {
            setScreenIndex(0)
        }
    }, [opened])

    return (
        <div>
            <TabBarWrapper>
                <TabBar
                    items={['Deposit', 'Withdraw']}
                    selected={screenIndex}
                    onChange={setScreenIndex}
                />
            </TabBarWrapper>

            {screenIndex === 0 && (
                <Deposit
                    tokens={tokens} handleDeposit={handleDeposit}
                />
            )}
            {screenIndex === 1 && (
                <Withdraw
                    tokens={tokens} handleWithdraw={handleWithdraw}
                />
            )}
        </div>
    )
}

const TabBarWrapper = styled.div`
  margin: 0 -30px 30px;
`

export default TransferPanel

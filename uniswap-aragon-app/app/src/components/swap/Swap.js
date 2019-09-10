import React from "react"
import styled from 'styled-components'
import Balances from "../balances/Balances";
import {Box, DataView, Text, theme} from "@aragon/ui";

const PAGINATION = 10

const Swap = ({balances, swapState, handleTransfer, compactMode}) => {

    const {tokenSwaps} = swapState

    const dataViewTokenSwapsData = tokenSwaps.map(tokenSwap => tokenSwap.dataViewFormat)

    return (
        <SwapContainer>
            <Balances compactMode={compactMode} balances={balances} handleTransfer={handleTransfer}/>

            {(dataViewTokenSwapsData || []).length > 0 ?
                <DataView
                    fields={['Sold', 'Bought', 'Time']}
                    entries={dataViewTokenSwapsData || []}
                    renderEntry={([input, output, timestamp]) => [
                        <Text
                            size="large"
                            weight="bold"
                            color={String(theme.negative)}>
                            {input}
                        </Text>,
                        <Text
                            size="large"
                            weight="bold"
                            color={String(theme.positive)}>
                            {output}
                        </Text>,
                        <Text>
                            {timestamp}
                        </Text>,
                    ]}
                    mode="table"
                    entriesPerPage={PAGINATION}
                /> :
                <Box style={{textAlign: 'center'}}>
                    <Text>No swaps</Text>
                </Box>}
        </SwapContainer>
    )
}

const SwapContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export default Swap

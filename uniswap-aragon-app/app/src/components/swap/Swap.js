import React from "react"
import styled from 'styled-components'
import Balances from "../balances/Balances";

// TODO: Add table of successful swaps.
const Swap = ({balances, swapState, handleTransfer, compactMode}) => {

    return (
        <SwapContainer>
            <Balances compactMode={compactMode} balances={balances} handleTransfer={handleTransfer}/>

            {/*{(compoundTransactions || []).length > 0 ?*/}
            {/*    <DataView*/}
            {/*        fields={['Transaction', 'Time']}*/}
            {/*        entries={dataViewEntries}*/}
            {/*        renderEntry={([type, time]) => [*/}
            {/*            <Text>*/}
            {/*                {type}*/}
            {/*            </Text>,*/}
            {/*            <Text>*/}
            {/*                {time}*/}
            {/*            </Text>,*/}
            {/*        ]}*/}
            {/*        mode="table"*/}
            {/*        entriesPerPage={PAGINATION}*/}
            {/*    /> :*/}
            {/*    <Box style={{textAlign: 'center'}}>*/}
            {/*        <Text>No transactions</Text>*/}
            {/*    </Box>}*/}
        </SwapContainer>
    )
}

const SwapContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export default Swap

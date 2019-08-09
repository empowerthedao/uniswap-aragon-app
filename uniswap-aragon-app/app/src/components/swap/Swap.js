import React from "react"
import Balances from "./Balances";
import styled from "styled-components";

const SpacedBlock = styled.div`
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
`

const Swap = ({swapState, handleTransfer}) => {

    const {balances} = swapState

    return (
        <>
            <SpacedBlock>
                <Balances balances={balances} handleTransfer={handleTransfer}/>
            </SpacedBlock>
        </>
    )

}

export default Swap

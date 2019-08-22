import React from "react"
import styled from "styled-components";
import Balances from "../balances/Balances";

const SpacedBlock = styled.div`
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
`

const Swap = ({balances, handleTransfer, compactMode}) => {

    return (
        <>
            <SpacedBlock>
                <Balances compactMode={compactMode} balances={balances} handleTransfer={handleTransfer}/>
            </SpacedBlock>
        </>
    )

}

export default Swap

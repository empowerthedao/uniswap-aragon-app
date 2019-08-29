import React from "react"
import Balances from "../balances/Balances";

// TODO: Add table of successful swaps.
const Swap = ({balances, handleTransfer, compactMode}) => {

    return (
        <>
            <Balances compactMode={compactMode} balances={balances} handleTransfer={handleTransfer}/>
        </>
    )
}

export default Swap

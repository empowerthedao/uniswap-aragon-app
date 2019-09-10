import React, {useState} from 'react'
import {Info, Field, TextInput, Button} from '@aragon/ui'
import styled from "styled-components";
import TokenSelector from "../../token-selector/TokenSelector";

const CUSTOM_TOKEN_DECIMALS = -1

const Deposit = ({tokens, handleDeposit}) => {

    const [tokenSelected, setTokenSelected] = useState(0)
    const [otherToken, setOtherToken] = useState("")
    const [amount, setAmount] = useState(0)

    const showOtherTokenInput = tokenSelected === tokens.length

    const getSelectedTokenAddress = () => showOtherTokenInput ? otherToken : tokens[tokenSelected].address
    const getSelectedTokenDecimals = () => showOtherTokenInput ? CUSTOM_TOKEN_DECIMALS : tokens[tokenSelected].decimals

    const handleSubmit = (event) => {
        event.preventDefault()
        handleDeposit(getSelectedTokenAddress(), amount, getSelectedTokenDecimals())
    }

    return (
        <form onSubmit={handleSubmit}>
            <DepositContainer>

                <TokenSelector onSelectToken={setTokenSelected}
                               onOtherInput={setOtherToken}
                               tokens={tokens}
                               selectedIndex={tokenSelected}
                               wide/>

                <FieldStyled label="Amount">
                    <TextInput type="number"
                               wide
                               required
                               min={0}
                               step="any"
                               onChange={event => setAmount(event.target.value)}/>
                </FieldStyled>

                <ButtonStyled wide mode="strong"
                              type="submit">
                    Submit Deposit
                </ButtonStyled>

                <Info.Action title="Transfer action">
                    This action will deposit the specified amount of Tokens or Ether to the Compound App's Agent.
                </Info.Action>
            </DepositContainer>
        </form>
    )
}

const DepositContainer = styled.div`
    display:flex;
    flex-direction: column;
`
const FieldStyled = styled(Field)`
    margin-bottom: 20px;
`
const ButtonStyled = styled(Button)`
    margin-top: 10px;
    margin-bottom: 30px;
`

export default Deposit
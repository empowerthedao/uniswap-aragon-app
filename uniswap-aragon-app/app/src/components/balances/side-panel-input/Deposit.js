import React, {useState} from 'react'
import {Info, DropDown, Field, TextInput, Button} from '@aragon/ui'
import styled from "styled-components";

const CUSTOM_TOKEN_DECIMALS = -1

// TODO: Replace dropdown with TokenSelector (see new Finance app)
const Deposit = ({tokens, handleDeposit}) => {

    const [tokenSelected, setTokenSelected] = useState(0)
    const [otherToken, setOtherToken] = useState("")
    const [amount, setAmount] = useState(0)

    const tokensAvailable = tokens.map(token => token.name)
    tokensAvailable.push("Other...")

    const showOtherTokenInput = tokenSelected === tokensAvailable.length - 1

    const getSelectedTokenAddress = () => showOtherTokenInput ? otherToken : tokens[tokenSelected].address
    const getSelectedTokenDecimals = () => showOtherTokenInput ? CUSTOM_TOKEN_DECIMALS : tokens[tokenSelected].decimals

    const handleSubmit = (event) => {
        event.preventDefault()
        handleDeposit(getSelectedTokenAddress(), amount, getSelectedTokenDecimals())
    }

    return (
        <form onSubmit={handleSubmit}>
            <DepositContainer>

                <FieldStyled label="Token">
                    <DropDown items={tokensAvailable}
                              required
                              onChange={selectedTokenIndex => setTokenSelected(selectedTokenIndex)}
                              selected={tokenSelected}
                              wide/>
                </FieldStyled>

                {showOtherTokenInput && (
                    <FieldStyled label="Token Address">
                        <TextInput type="text"
                                   wide
                                   required={showOtherTokenInput}
                                   onChange={event => setOtherToken(event.target.value)}/>
                    </FieldStyled>
                )}

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
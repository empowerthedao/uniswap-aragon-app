import React, {useState} from 'react'
import {
    Info, DropDown, Field, TextInput, Button, unselectable, useTheme
} from '@aragon/ui'
import styled from "styled-components";

const Withdraw = ({tokens, handleWithdraw}) => {

    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState(0)
    const [selectedCurrency, setSelectedCurrency] = useState(0)

    const tokenSymbols = tokens.map(token => token.symbol)

    const getSelectedTokenAddress = () => tokens[selectedCurrency].address
    const getSelectedTokenDecimals = () => tokens[selectedCurrency].decimals

    const handleSubmit = (event) => {
        event.preventDefault()
        handleWithdraw(getSelectedTokenAddress(), recipient, amount, getSelectedTokenDecimals())
    }

    return (
        <form onSubmit={handleSubmit}>
            <WithdrawContainer>

                <FieldStyled label="Recipient">
                    <TextInput type="text"
                               wide
                               required
                               onChange={event => setRecipient(event.target.value)}/>
                </FieldStyled>

                <label>
                    <StyledTextBlock>
                        Amount
                        <StyledAsterisk/>
                    </StyledTextBlock>
                </label>
                <CombinedInput>
                    <TextInput
                        type="number"
                        onChange={event => setAmount(event.target.value)}
                        min={0}
                        step="any"
                        required
                        wide
                    />
                    <DropDown css={`margin-left: 16px;`}
                              items={tokenSymbols}
                              selected={selectedCurrency}
                              onChange={selectedTokenIndex => setSelectedCurrency(selectedTokenIndex)}
                    />
                </CombinedInput>

                <ButtonStyled wide mode="strong"
                              type="submit">
                    Submit Withdrawal
                </ButtonStyled>

                <Info.Action title="Transfer action">
                    This action will withdraw the specified amount of Tokens or Ether from the Compound App's Agent.
                </Info.Action>
            </WithdrawContainer>
        </form>
    )
}

const WithdrawContainer = styled.div`
    display:flex;
    flex-direction: column;
`
const FieldStyled = styled(Field)`
    margin-bottom: 19px;
`
const ButtonStyled = styled(Button)`
    margin-top: 10px;
    margin-bottom: 30px;
`

const CombinedInput = styled.div`
  display: flex;
  margin-top: 3px;
  margin-bottom: 20px;
  input[type='text'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
  input[type='text'] + div > div:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`

const StyledTextBlock = props => {
    const theme = useTheme()
    return (
        <div
            css={`
        color: ${theme.surfaceContentSecondary};
        display: flex;
        text-transform: uppercase;
        font-weight: 600;
        font-size: 12px;
        line-height: 1.5;
        ${unselectable()};
      `}
            {...props}
        />
    )
}

const StyledAsterisk = props => {
    const theme = useTheme()
    return (
        <span
            title="Required"
            css={`
        color: ${theme.accent};
        margin-left: 3px;
        font-size: 12px;
      `}
            {...props}
        >
      *
    </span>
    )
}

export default Withdraw
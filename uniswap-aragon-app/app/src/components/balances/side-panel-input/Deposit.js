import React, {useState, useEffect} from 'react'
import {
    Info,
    Field,
    TextInput,
    Button,
    useTheme,
    IconCross,
    textStyle,
    GU
} from '@aragon/ui'
import {isAddress} from "../../../lib/web3-utils"
import styled from "styled-components";
import TokenSelector from "./token-selector/TokenSelector";

const CUSTOM_TOKEN_DECIMALS = -1

const Deposit = ({tokens, handleDeposit, checkConnectedAccountBalance}) => {

    const [tokenSelected, setTokenSelected] = useState(0)
    const [otherToken, setOtherToken] = useState("")
    const [amount, setAmount] = useState(0)
    const [balanceAvailable, setBalanceAvailable] = useState(true)

    const showOtherTokenInput = tokenSelected === tokens.length

    const getSelectedTokenAddress = () => showOtherTokenInput ? otherToken : tokens[tokenSelected].address
    const getSelectedTokenDecimals = () => showOtherTokenInput ? CUSTOM_TOKEN_DECIMALS : tokens[tokenSelected].decimals

    const showInvalidTokenError = !(showOtherTokenInput ? isAddress(otherToken) : true)
    const showBalanceError = amount > 0 && !balanceAvailable
    const displayError = (showInvalidTokenError && otherToken !== "") || showBalanceError

    let errorMessage
    if (showBalanceError) {
        errorMessage = 'Amount is greater than balance held'
    } else if (showInvalidTokenError) {
        errorMessage = 'Invalid token address'
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        handleDeposit(getSelectedTokenAddress(), amount, getSelectedTokenDecimals())
    }

    useEffect(() => {
        checkConnectedAccountBalance(getSelectedTokenAddress(), amount, setBalanceAvailable)
    }, [tokenSelected, amount, otherToken])

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

                <Button css={`
                        margin-top: 10px;
                        margin-bottom: ${displayError ? "5px;" : "30px;"}`}
                        wide
                        mode="strong"
                        type="submit"
                        disabled={showInvalidTokenError || showBalanceError}>
                    Submit Deposit
                </Button>

                {displayError && <ValidationError message={errorMessage}/>}

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
const VSpace = styled.div`
  height: ${p => (p.size || 1) * GU}px;
`

const ValidationError = ({message}) => {
    const theme = useTheme()
    return (
        <div css={`margin-bottom: 20px;`}>
            <VSpace size={2}/>
            <div
                css={`
          display: flex;
          align-items: center;
        `}
            >
                <IconCross
                    size="tiny"
                    css={`
            color: ${theme.negative};
            margin-right: ${1 * GU}px;
          `}
                />
                <span
                    css={`
            ${textStyle('body3')}
          `}
                >
          {message}
                </span>
            </div>
        </div>
    )
}

export default Deposit
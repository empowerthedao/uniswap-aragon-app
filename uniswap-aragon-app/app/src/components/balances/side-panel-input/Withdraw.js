import React, {useState} from 'react'
import {
    Info,
    DropDown,
    Field,
    TextInput,
    Button,
    unselectable,
    useTheme,
    IconCross,
    GU,
    textStyle
} from '@aragon/ui'
import styled from "styled-components";
import {toDecimals} from "../../../lib/math-utils";
import BN from "bn.js";

const Withdraw = ({balances, tokens, handleWithdraw}) => {

    const tokensWithBalance = tokens.filter(token => token.amount && token.amount > 0)

    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState(0)
    const [selectedToken, setSelectedToken] = useState(0)

    const tokenSymbols = tokensWithBalance.map(token => token.symbol)

    const getSelectedTokenAddress = () => tokensWithBalance[selectedToken].address
    const getSelectedTokenDecimals = () => tokensWithBalance[selectedToken].decimals
    const getSelectedTokenBalance = () => balances
        .find(balance => balance.address === tokensWithBalance[selectedToken].address).amount

    const handleSubmit = (event) => {
        event.preventDefault()
        handleWithdraw(getSelectedTokenAddress(), recipient, amount, getSelectedTokenDecimals())
    }

    const showBalanceError = () => {
        const amountWithDecimals = toDecimals(amount.toString(), parseInt(getSelectedTokenDecimals()))
        const amountBn = new BN(amountWithDecimals)
        const selectedTokenBalanceBn = new BN(getSelectedTokenBalance())
        return amountBn.gt(selectedTokenBalanceBn)
    }

    const displayError = showBalanceError()

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
                              selected={selectedToken}
                              onChange={selectedTokenIndex => setSelectedToken(selectedTokenIndex)}
                    />
                </CombinedInput>

                <Button css={`
                            margin-top: 10px;
                            margin-bottom: ${displayError ? "5px;" : "30px;"}`}
                        wide
                        mode="strong"
                        type="submit"
                        disabled={displayError}>
                    Submit Withdrawal
                </Button>

                {displayError && <ValidationError message={"Amount is greater than the Agent's balance"}/>}

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
    margin-bottom: 23px;
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

export default Withdraw
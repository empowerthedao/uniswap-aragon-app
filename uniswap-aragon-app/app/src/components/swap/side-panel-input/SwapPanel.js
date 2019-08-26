import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Button, DropDown, Info, TextInput, unselectable, useTheme} from '@aragon/ui'

const SwapPanel = ({swapPanelState, handleSwap}) => {

    const {uniswapTokens, getTokensForEthExchangeRate} = swapPanelState

    const [selectedInputToken, setSelectedInputToken] = useState(0)
    const [inputAmount, setInputAmount] = useState("")

    const [selectedOutputToken, setSelectedOutputToken] = useState(0)
    const [outputAmount, setOutputAmount] = useState("")

    const uniswapTokensSymbols = (uniswapTokens || []).map(uniswapToken => uniswapToken.symbol)

    const handleSubmit = (event) => {
        event.preventDefault()
        handleSwap(uniswapTokens[selectedInputToken], inputAmount, uniswapTokens[selectedOutputToken], outputAmount)
    }

    const updateExchangeRate = () => getTokensForEthExchangeRate(uniswapTokens[selectedOutputToken], inputAmount, setOutputAmount)

    useEffect(() => {
        updateExchangeRate()
    }, [inputAmount])

    return (
        <form onSubmit={event => handleSubmit(event)}>
            <DepositContainer>

                <label>
                    <StyledTextBlock>
                        Input
                        <StyledAsterisk/>
                    </StyledTextBlock>
                </label>
                <CombinedInput>
                    <TextInput
                        type="number"
                        onChange={event => {
                            setInputAmount(event.target.value)
                        }}
                        min={0}
                        step="any"
                        required
                        wide
                    />
                    <DropDown css={`margin-left: 16px;`}
                              items={uniswapTokensSymbols}
                              selected={selectedInputToken}
                              onChange={selectedTokenIndex => setSelectedInputToken(selectedTokenIndex)}
                    />
                </CombinedInput>

                <label>
                    <StyledTextBlock>
                        Output
                        <StyledAsterisk/>
                    </StyledTextBlock>
                </label>
                <CombinedInput>
                    <TextInput
                        value={outputAmount}
                        type="number"
                        onChange={event => setOutputAmount(event.target.value)}
                        min={0}
                        step="any"
                        required
                        wide
                    />
                    <DropDown css={`margin-left: 16px;`}
                              items={uniswapTokensSymbols}
                              selected={selectedOutputToken}
                              onChange={selectedTokenIndex => setSelectedOutputToken(selectedTokenIndex)}
                    />
                </CombinedInput>


                <ButtonStyled wide mode="strong"
                              type="submit">
                    Swap funds
                </ButtonStyled>

                <Info.Action title="Swap action">
                    This action will exchange the specified input amount of Ether or Tokens from the Uniswap app's Agent
                    for at least the output value specified.
                </Info.Action>
            </DepositContainer>
        </form>
    )
}

const DepositContainer = styled.div`
    display:flex;
    flex-direction: column;
    padding-top: 30px;
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

export default SwapPanel

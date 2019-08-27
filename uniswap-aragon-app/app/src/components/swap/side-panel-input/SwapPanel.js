import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Button, DropDown, Info, TextInput, unselectable, useTheme} from '@aragon/ui'

const SELECTOR_SYMBOL_INDEX = 0
const SELECTOR_SYMBOL = "..."
const ETH_SYMBOL = "ETH"

const SwapPanel = ({swapPanelState, handleSwap}) => {

    const {uniswapTokens, getTokensForEthExchangeRate} = swapPanelState

    const uniswapTokensSymbols = (uniswapTokens || []).map(uniswapToken => uniswapToken.symbol)
    const uniswapTokensSymbolsWithSelector = ["...", ...uniswapTokensSymbols]

    const [inputAmount, setInputAmount] = useState("")
    const [selectedInputToken, setSelectedInputToken] = useState(0)
    const [inputTokensSymbols, setInputTokensSymbols] = useState([...uniswapTokensSymbolsWithSelector])

    const [outputAmount, setOutputAmount] = useState("")
    const [selectedOutputToken, setSelectedOutputToken] = useState(0)
    const [outputTokensSymbols, setOutputTokensSymbols] = useState([...uniswapTokensSymbolsWithSelector])


    const handleSubmit = (event) => {
        event.preventDefault()
        if (selectedInputToken !== SELECTOR_SYMBOL_INDEX && selectedOutputToken !== SELECTOR_SYMBOL_INDEX) {
            handleSwap(uniswapTokens[selectedInputToken - 1], inputAmount, uniswapTokens[selectedOutputToken - 1], outputAmount)
        }
    }

    const updateExchangeRate = () => getTokensForEthExchangeRate(uniswapTokens[selectedOutputToken], inputAmount, setOutputAmount)

    useEffect(() => {
        updateExchangeRate()
    }, [inputAmount])

    const positionOfSelector = (tokenSymbols) => tokenSymbols.indexOf(SELECTOR_SYMBOL)

    const positionOfEthSymbol = (tokenSymbols) => tokenSymbols.indexOf(ETH_SYMBOL)

    const updateSymbolsOnInputTokenSelection = (selectedInputTokenIndex) => {

        if (selectedInputTokenIndex === positionOfSelector(inputTokensSymbols)) {

            const selectedOutputTokenSymbol = outputTokensSymbols[selectedOutputToken]
            setSelectedOutputToken(uniswapTokensSymbolsWithSelector.indexOf(selectedOutputTokenSymbol))

            setOutputTokensSymbols([...uniswapTokensSymbolsWithSelector])

        } else if (selectedInputTokenIndex === positionOfEthSymbol(inputTokensSymbols)) {

            const filteredUniswapTokensSymbols = [...uniswapTokensSymbolsWithSelector.filter(symbol => symbol !== ETH_SYMBOL || symbol === SELECTOR_SYMBOL)]
            const selectedOutputTokenSymbol = outputTokensSymbols[selectedOutputToken]
            setSelectedOutputToken(filteredUniswapTokensSymbols.indexOf(selectedOutputTokenSymbol))

            setOutputTokensSymbols(filteredUniswapTokensSymbols)
        } else {
            setOutputTokensSymbols([...uniswapTokensSymbolsWithSelector.filter(symbol => symbol === ETH_SYMBOL || symbol === SELECTOR_SYMBOL)])
        }

        setSelectedInputToken(selectedInputTokenIndex)
    }

    const updateSymbolsOnOutputTokenSelection = (selectedOutputTokenIndex) => {

        if (selectedOutputTokenIndex === positionOfSelector(outputTokensSymbols)) {

            const selectedInputTokenSymbol = inputTokensSymbols[selectedInputToken]
            setSelectedInputToken(uniswapTokensSymbolsWithSelector.indexOf(selectedInputTokenSymbol))

            setInputTokensSymbols([...uniswapTokensSymbolsWithSelector])

        } else if (selectedOutputTokenIndex === positionOfEthSymbol(outputTokensSymbols)) {

            const filteredUniswapTokensSymbols = [...uniswapTokensSymbolsWithSelector.filter(symbol => symbol !== ETH_SYMBOL || symbol === SELECTOR_SYMBOL)]
            const selectedInputTokenSymbol = inputTokensSymbols[selectedInputToken]
            setSelectedInputToken(filteredUniswapTokensSymbols.indexOf(selectedInputTokenSymbol))

            setInputTokensSymbols(filteredUniswapTokensSymbols)
        } else {
            setInputTokensSymbols([...uniswapTokensSymbolsWithSelector.filter(symbol => symbol === ETH_SYMBOL || symbol === SELECTOR_SYMBOL)])
        }

        setSelectedOutputToken(selectedOutputTokenIndex)
    }

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
                    <DropDown css={`margin-left: 16px; min-width: 87px;`}
                              items={inputTokensSymbols}
                              selected={selectedInputToken}
                              onChange={selectedTokenIndex => updateSymbolsOnInputTokenSelection(selectedTokenIndex)}
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
                    <DropDown css={`margin-left: 16px; min-width: 87px;`}
                              items={outputTokensSymbols}
                              selected={selectedOutputToken}
                              onChange={selectedTokenIndex => updateSymbolsOnOutputTokenSelection(selectedTokenIndex)}
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

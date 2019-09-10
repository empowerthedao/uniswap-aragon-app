import React from 'react'
import styled from 'styled-components'
import throttle from 'lodash.throttle'
import {theme, breakpoint, Button, Box} from '@aragon/ui'
import BalanceToken from './BalanceToken'
import {round} from '../../lib/math-utils'
import AbortController from 'abort-controller'

const CONVERT_API_BASE = 'https://min-api.cryptocompare.com/data'
const CONVERT_THROTTLE_TIME = 5000

const convertApiUrl = symbols =>
    `${CONVERT_API_BASE}/price?fsym=USD&tsyms=${symbols.join(',')}`

class Balances extends React.Component {
    controller = new AbortController()

    state = {
        convertRates: {},
    }

    componentDidMount() {
        this.updateConvertedRates(this.props)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.updateConvertedRates(nextProps)
    }

    updateConvertedRates = throttle(async ({balances}) => {

        const verifiedSymbols = balances
            .filter(({verified}) => verified)
            .map(({symbol}) => symbol)

        if (!verifiedSymbols.length) {
            return
        }

        const res = await fetch(convertApiUrl(verifiedSymbols), {
            signal: this.controller.signal
        })
        const convertRates = await res.json()
        this.setState({convertRates})
    }, CONVERT_THROTTLE_TIME)

    componentWillUnmount() {
        this.controller.abort()
    }

    render() {
        const {compactMode, balances, handleTransfer} = this.props
        const {convertRates} = this.state
        const balanceItems = balances.map(
            ({address, numData: {amount, decimals}, symbol, verified}) => {
                const adjustedAmount = amount / Math.pow(10, decimals)
                const convertedAmount =
                    verified && convertRates[symbol]
                        ? adjustedAmount / convertRates[symbol]
                        : -1
                return {
                    address,
                    symbol,
                    verified,
                    amount: round(adjustedAmount, 5),
                    convertedAmount: round(convertedAmount, 5),
                }
            }
        )
        return (
            <Box heading={"Agent Balances"} padding={compactMode ? 0 : 24}>
                <div css={`
                    /*
                    * translate3d() fixes an issue on recent Firefox versions where the
                    * scrollbar would briefly appear on top of everything (including the
                    * sidepanel overlay).
                    */
                    transform: translate3d(0, 0, 0);
                    overflow-x: auto;
                  `}>
                    <ul css={`
                      list-style: none;
                      padding: 0;
                      margin: 0;
                      display: flex;
                      ${compactMode && `flex-direction: column;`}
                      ${!compactMode && `align-items: center;`}
                    `}>
                        {balanceItems.length > 0 ? (
                            balanceItems.map(
                                ({address, amount, convertedAmount, symbol, verified}) => (
                                    <ListItem key={address}>
                                        <BalanceToken
                                            amount={amount}
                                            convertedAmount={convertedAmount}
                                            symbol={symbol}
                                            verified={verified}
                                            compactMode={compactMode}
                                        />
                                    </ListItem>
                                )
                            )
                        ) : (
                            <EmptyListItem/>
                        )}
                        <li css={`margin-left: 30px;`}>
                            {!compactMode &&
                            AddTokenButton(false, 'normal', handleTransfer)}
                        </li>
                    </ul>
                </div>
                {compactMode && (
                    <Wrapper>{AddTokenButton(true, 'strong', handleTransfer)}</Wrapper>
                )}
            </Box>
        )
    }
}

const EmptyListItem = () => (
    <ListItem style={{opacity: '0'}}>
        <BalanceToken amount={0} convertedAmount={0}/>
    </ListItem>
)

const AddTokenButton = (wide, mode, onClick) => (
    <Button wide={wide} mode={mode} onClick={() => onClick()}>
        {"Transfer"}
    </Button>
)

const ListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 8px 20px;
  border-bottom: 1px solid ${theme.contentBorder};

  ${breakpoint(
    'medium',
    `
      display: block;
      padding: 20px;
      border: 0;
    `
)};
`

const Wrapper = styled.div`
  margin: 15px 15px;
`

export default Balances

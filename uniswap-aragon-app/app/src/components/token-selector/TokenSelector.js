import React from 'react'
import { DropDown, Field, TextInput, Text} from '@aragon/ui'
import { useNetwork } from '@aragon/api-react'
import TokenSelectorInstance from './TokenSelectorInstance'

const INITIAL_STATE = {
  customToken: {
    address: '',
    value: '',
  },
}

class TokenSelector extends React.Component {

  static defaultProps = {
    onSelectToken: () => {},
      onOtherInput: () => {},
    tokens: [],
    label: 'Token',
    labelCustomToken: 'Token address',
    selectedIndex: 0,
  }

  state = {
    ...INITIAL_STATE,
  }

  getItems() {
      return [...this.getTokenItems(), <Text>Other...</Text>]
  }

  getTokenItems() {
    return this.props.tokens.map(({ address, name, symbol, verified }) => (
      <TokenSelectorInstance
        address={address}
        name={name}
        showIcon={verified}
        symbol={symbol}
      />
    ))
  }

  render() {
    const { label, labelCustomToken, selectedIndex, onSelectToken, onOtherInput } = this.props
    const items = this.getItems()
    const showCustomToken = selectedIndex === items.length - 1
    return (
      <React.Fragment>
        <Field label={label}>
          <DropDown
            placeholder="Select a token"
            items={items}
            selected={selectedIndex}
            onChange={index => onSelectToken(index)}
            required
            wide
          />
        </Field>

        {showCustomToken && (
          <Field label={labelCustomToken}>
            <TextInput
              onChange={event => onOtherInput(event.target.value)}
              required
              wide
            />
          </Field>
        )}
      </React.Fragment>
    )
  }
}

export default props => {
  const network = useNetwork()
  return <TokenSelector network={network} {...props} />
}

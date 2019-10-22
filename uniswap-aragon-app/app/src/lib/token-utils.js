import { ETHER_TOKEN_VERIFIED_BY_SYMBOL } from "./verified-tokens"
import { ETHER_TOKEN_FAKE_ADDRESS } from "./shared-constants"
import { tokenIconUrl } from "@aragon/ui"

const mainnetAddressForSymbol = (symbol) => {
    return ETHER_TOKEN_VERIFIED_BY_SYMBOL.get(symbol)
}

const iconSourceUrl = (network, address, symbol) => {
    if (!network) return ""

    if (address === ETHER_TOKEN_FAKE_ADDRESS) {
        return "https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/ethereum/info/logo.png"
    } else if (network.type === 'main') {
        return tokenIconUrl(address)
    } else {
        return tokenIconUrl(mainnetAddressForSymbol(symbol))
    }
}

export {
    iconSourceUrl
}
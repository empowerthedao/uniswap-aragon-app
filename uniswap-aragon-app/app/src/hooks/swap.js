import {useAppState} from "@aragon/api-react";
import {ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";

export function useSwapPanelState() {
    const {uniswapTokens, tokens} = useAppState()

    const ethToken = tokens.find(token => token.address === ETHER_TOKEN_FAKE_ADDRESS)
    const uniswapTokensWithEth = [ethToken, ...(uniswapTokens || [])]

    return {
        uniswapTokens: uniswapTokensWithEth
    }
}
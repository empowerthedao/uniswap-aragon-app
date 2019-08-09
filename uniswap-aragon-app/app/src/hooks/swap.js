import {useAppState} from "@aragon/api-react";

export function useSwapState() {
    const {balances} = useAppState()

    return {
        balances
    }
}
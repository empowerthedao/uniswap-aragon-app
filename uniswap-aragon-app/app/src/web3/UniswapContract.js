import {toDecimals} from "../lib/math-utils";
import {ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";
import {tokenContract$} from "./ExternalContracts";
import {mergeMap} from 'rxjs/operators'

const MAX_CONFIRMATION_PERIOD_SECONDS = 100

const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

const withdraw = (api, token, recipient, amount, decimals) => {
    const adjustedAmount = toDecimals(amount, decimals)
    api.transfer(token, recipient, adjustedAmount)
        .subscribe()
}

async function deposit(api, tokenAddress, amount, decimals) {

    if (decimals === -1) {
        decimals = await tokenContract$(api, tokenAddress).pipe(
            mergeMap(token => token.decimals())).toPromise()
        decimals = parseInt(decimals)
    }

    const adjustedAmount = toDecimals(amount, decimals)

    if (tokenAddress === ETHER_TOKEN_FAKE_ADDRESS) {
        api.deposit(tokenAddress, adjustedAmount, {value: adjustedAmount})
            .subscribe()
    } else {
        api.deposit(tokenAddress, adjustedAmount, {
            token: {
                address: tokenAddress,
                value: adjustedAmount
            }
        })
            .subscribe()
    }
}

async function ethToTokenSwapInput(api, inputToken, inputAmount, outputToken, minOutputAmount) {

    const convertedInputAmount = toDecimals(inputAmount, parseInt(inputToken.decimals))
    const convertedOutputAmount = toDecimals(minOutputAmount, parseInt(outputToken.decimals))

    const currentBlock = await api.web3Eth('getBlock', 'latest').toPromise()
    const deadline = currentBlock.timestamp + MAX_CONFIRMATION_PERIOD_SECONDS

    api.ethToTokenSwapInput(outputToken.address, convertedInputAmount, convertedOutputAmount, deadline)
        .subscribe()
}

export {
    setAgent,
    withdraw,
    deposit,
    ethToTokenSwapInput
}
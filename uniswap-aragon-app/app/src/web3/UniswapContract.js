import {toDecimals} from "../lib/math-utils";
import {ETHER_TOKEN_FAKE_ADDRESS} from "../lib/shared-constants";
import {tokenContract$} from "./ExternalContracts";
import {mergeMap} from 'rxjs/operators'

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

async function ethToTokenSwapInput (api, inputToken, inputAmount, outputToken, minOutputAmount) {

    // ethToTokenSwapInput(address _token, uint256 _ethAmount, uint256 _minTokenAmount, uint256 _secondsUntilExpired)



    const convertedInputAmount = toDecimals(inputAmount, inputToken.decimals)

    const currentBlock = await api.web3Eth('getBlock', 'latest').toPromise()
    const deadline = currentBlock.timestamp + 100



    api.ethToTokenSwapInput("0x65A79E38fCb0156d45B85f4b31CC4042021d75DD", convertedInputAmount, 320453798885757512036, deadline)
        .subscribe()
}

export {
    setAgent,
    withdraw,
    deposit,
    ethToTokenSwapInput
}
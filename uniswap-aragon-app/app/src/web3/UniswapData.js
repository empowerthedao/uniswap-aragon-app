import {uniswapFactory$} from "./ExternalContracts";
import {range} from "rxjs"
import {mergeMap, toArray} from "rxjs/operators";

const availableUniswapTokens$ = api =>
    uniswapFactory$(api).pipe(
        mergeMap(uniswapFactory => uniswapFactory.tokenCount().pipe(
            mergeMap(tokenCount => range(1, tokenCount)),
            mergeMap(tokenId => uniswapFactory.getTokenWithId(tokenId)))),
        toArray())

export {
    availableUniswapTokens$
}

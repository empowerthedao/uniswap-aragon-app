import {first, map} from "rxjs/operators";
import {ETHER_TOKEN_VERIFIED_ADDRESSES} from "../lib/verified-tokens";

const network$ = api =>
    api.network()
        .pipe(first())

const isTokenVerified = (tokenAddress, networkType) =>
    // The verified list is without checksums
    networkType === 'main'
        ? ETHER_TOKEN_VERIFIED_ADDRESSES.has(tokenAddress.toLowerCase())
        : true

const isTokenVerified$ = (api, tokenAddress) =>
    network$(api).pipe(
        map(network => isTokenVerified(tokenAddress, network)))

export {
    isTokenVerified$
}
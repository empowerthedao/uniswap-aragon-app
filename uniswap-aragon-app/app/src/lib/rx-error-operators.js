import {catchError} from "rxjs/operators";
import {of} from "rxjs";

const onErrorReturnDefault = (errorContext, defaultReturnValue) =>
    catchError(error => {
        console.error(`Script error fetching ${errorContext}: ${error}`)
        return of(defaultReturnValue)
    })

export {
    onErrorReturnDefault
}
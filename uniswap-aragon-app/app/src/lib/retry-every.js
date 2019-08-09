
const retryEvery = (callback, initialRetryTimer = 1000, increaseFactor = 5) => {
    const attempt = (retryTimer = initialRetryTimer) => {
        // eslint-disable-next-line standard/no-callback-literal
        callback(() => {
            console.error(`Retrying in ${retryTimer / 1000}s...`)

            // Exponentially backoff attempts
            setTimeout(() => attempt(retryTimer * increaseFactor), retryTimer)
        })
    }
    attempt()
}

export default retryEvery
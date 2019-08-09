export default class RPC {

    constructor(web3) {
        this.web3 = web3
    }

    sendAsync(method, arg) {
        const req = {
            jsonrpc: "2.0",
            method: method,
            id: new Date().getTime()
        }

        if (arg) req.params = arg

        return new Promise((resolve, reject) => {
            return this.web3.currentProvider.send(req, (err, result) => { // Note 'send' has been changed from 'sendAsync' to support web3.js 1.0 syntax
                if (err) {
                    reject(err)
                } else if (result && result.error) {
                    reject(new Error("RPC Error: " + (result.error.message || result.error)))
                } else {
                    resolve(result)
                }
            })
        })
    }

    snapshot() {
        return this.sendAsync("evm_snapshot")
            .then(res => res.result)
    }

    revert(snapshotId) {
        return this.sendAsync("evm_revert", [snapshotId])
    }
}

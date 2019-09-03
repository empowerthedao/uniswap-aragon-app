/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWallet = require('truffle-hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

const homedir = require('homedir')
const path = require('path')

const HDWalletProvider = require('truffle-hdwallet-provider')
const HDWalletProviderPrivkey = require('truffle-hdwallet-provider-privkey')

const DEFAULT_MNEMONIC =
    'explain tackle mirror kit van hammer degree position ginger unfair soup bonus'

const defaultRPC = network => `https://${network}.infura.io`

const configFilePath = filename => path.join(homedir(), `.aragon/${filename}`)

const mnemonic = () => {
    try {
        return require(configFilePath('mnemonic.json')).mnemonic
    } catch (e) {
        return DEFAULT_MNEMONIC
    }
}

const settingsForNetwork = network => {
    try {
        return require(configFilePath(`${network}_key.json`))
    } catch (e) {
        return {}
    }
}

// Lazily loaded provider
const providerForNetwork = network => () => {
    let {rpc, keys} = settingsForNetwork(network)
    rpc = rpc || defaultRPC(network)

    if (!keys || keys.length === 0) {
        return new HDWalletProvider(mnemonic(), rpc)
    }

    return new HDWalletProviderPrivkey(keys, rpc)
}

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        rinkeby: {
            network_id: 4,
            provider: providerForNetwork('rinkeby'),
        },
    }
}

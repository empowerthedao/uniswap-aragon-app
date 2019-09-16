# Local deployment

To deploy the Uniswap Aragon app locally first requires installing the Uniswap protocol locally, then copying key 
addresses from the deployment process into the Aragon app deployment script for the app to use. It is also advised that
all global dependencies be the most recent versions available, except for Node.

Pre-requisite dependencies:
- [NPM from Node v10](https://nodejs.org/en/download/)
- [Aragon CLI](https://github.com/aragon/aragon-cli)
- [Truffle](https://github.com/trufflesuite/truffle)
- [MetaMask](https://metamask.io/)
- Python and pip
- Python 3 and pip3

## Uniswap Protocol Deployment

This process deploys the Uniwap protocol to a local test chain with a single Uniswap exchange and gives it liquidity.

Instructions are for OSX, other OS's may require additional steps.

Execute the following within the `uniswap-aragon-app/uniswap-protocol` directory:

Setup virtual environment, necessary for Vyper compilation. Remove `uniswap-protocol/env` directory if already created and errors occur:
```
$ pip3 install virtualenv
$ virtualenv -p python3 env
$ source env/bin/activate
```

Install dependencies:
```
$ pip install -r requirements.txt
```

Run a test chain in a separate terminal:
```
$ aragon devchain
```

Deploy contracts:
```
$ truffle migrate
```

## Uniswap Protocol Scripts (Optional)
Scripts to emulate activity on the Uniswap protocol. 

To execute the scripts requires the contracts first be compiled with:
```
$ truffle compile
```

Add a token exchange:
```
$ truffle exec scripts/addTokenExchange.js
```

> The output token address can be used in the initialization of the Uniswap Aragon app to add a second token exchange 
for testing purposes.

## Uniswap Aragon App Deployment

Execute the following within the `uniswap-aragon-app/uniswap-aragon-app` directory.

Install dependencies:
```
$ npm install
```

Copy the Uniswap Token Factory address to the Aragon app deployment script:
- In the truffle migration output, find the `uniswap_factory` deployment and copy the `contract address`
- Open `uniswap-aragon-app/package.json` and paste the address into the `start:http:template` command as the last 
argument, replace the address that is already there. 

Copy the TestERC20 token address to the Aragon app deployment template:
- In the truffle migration output, find the `TestERC20` deployment and copy the `contract address`
- Open `uniswap-aragon-app/contracts/Template.sol` and push the address into the `enabledTokens` array in the `Template`
contract, you can replace the address that is already there. 

> Optionally, if you have added a second token exchange using the script provided, push the output token address to the
array in the `Template` as specified above, replace any address that is already there.

Serve the web portion of the Aragon app locally:
```
$ npm run start:app
```

Create a DAO and install an instance of the Uniswap Aragon app (requires canceling and re-executing on contract updates):
```
$ npm run start:http:template
```

After these steps have completed your web browser should open Aragon automatically with the Uniswap app installed. The
template is setup to give permissions for executing all of the functionality to any address so you should be able to
experiment straight away. 

Any changes made to the web portion of the app should update without any redeployment of the app.  

Any changes to `script.js` require rebuilding the script, to do this execute the following in the `uniswap-aragon-app/app` directory:
```
$ npm run build:script
```

For further instructions and alternative approaches to deploying Aragon apps locally, see the official 
[react app template](https://github.com/aragon/aragon-react-boilerplate).
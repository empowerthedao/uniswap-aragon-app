Instructions are for OSX, other OS's may require additional steps.

Pre-requisite dependencies:
- [NPM](https://nodejs.org/en/download/)
- [Ganache CLI](https://github.com/trufflesuite/ganache-cli) or [Aragon CLI](https://github.com/aragon/aragon-cli)
- [Truffle](https://github.com/trufflesuite/truffle)
- Python and pip
- Python 3 and pip3

To deploy uniswap to a local ganache instance/aragon devchain, run the following in the `uniswap-aragon-app/uniswap-protocol` directory:

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

Run `ganache-cli` or `aragon devchain` in a separate terminal:
```
$ ganache-cli
```

Deploy contracts (may want to modify uniswap-protocol/migrations/2_deploy_contracts.js):
```
$ truffle migrate
```

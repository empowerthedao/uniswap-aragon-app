To deploy uniswap to a local ganache instance/aragon devchain:

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

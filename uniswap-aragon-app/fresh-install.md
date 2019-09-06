This script will use aragonCLI to:

- Create a new Aragon DAO on Rinkeby
- Install and configure the Uniswap Aragon App

This new DAO will be able to swap ETH with Tokens using Uniswap.

### Pre-requisites

The following are required for completing this script:

- `aragonCLI` must be installed in your environment. Here is a [link to an introduction to aragonCLI](https://hack.aragon.org/docs/cli-intro.html).

- You must know your `<AragonCLI-Address>`, which is the address for the private key being used by your aragonCLI to sign transactions.

**During this script, new addresses will be created which will be required for further commands.**

### Create a new Aragon DAO on Rinkeby

Run the following command to **create a new DAO**:

```
dao new --environment aragon:rinkeby
```

> This returns `Created DAO: <DAO-Address>` for use in future commands.

### Create a Voting token

Run the following command to **create the voting token**:

```
dao token new "UniswapDAOToken" "USDAO" 0 --environment aragon:rinkeby
```

> This returns `Successfully deployed the token at <DAO-Token-Address>` for use in future commands.

### Install and configure the Tokens app in the DAO

Run the following command to **install the Tokens app in the DAO**:

```
dao install <DAO-Address> token-manager --app-init none --environment aragon:rinkeby
```

> This returns `Installed token-manager at: <Token-Manager-Proxy-Address>` for use in future commands.

Run the following commands to **configure the voting token and configure the Tokens app**:

```
dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <AragonCLI-Address> <AragonCLI-Address> --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <AragonCLI-Address> 1 --environment aragon:rinkeby
```

### Install and configure the Voting app in the DAO

Run the following command to **install the Voting app in the DAO and initialize it**:

```
dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 500000000000000000 3600 --environment aragon:rinkeby
```

> This returns `Installed voting at: <Voting-App-Proxy-Address>` for use in future commands.

Run the following command to **configure the Voting app**:

```
dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

### Install the Agent app in the DAO

Run the following command to **install the Agent app in the DAO**:

```
dao install <DAO-Address> agent --environment aragon:rinkeby
```

> This returns `Installed agent at: <Agent-App-Proxy-Address>` for use in future commands.

You have now created a new Aragon DAO on Rinkeby with voting token and base apps.

### Install the Uniswap Aragon App

Run the following command to **install the Uniswap app in the DAO**:

```
dao install <DAO-Address> uniswap.open.aragonpm.eth --app-init-args <Agent-App-Proxy-Address> <Uniswap-Factory-Address> ["'<Swap-Token-Address>'"] --environment aragon:rinkeby
```

> For `<Uniswap-Factory-Address>`, you can use `0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36` on Rinkeby, as defined in [Uniswap's documentation](https://docs.uniswap.io/frontend-integration/connect-to-uniswap).

> For `<Swap-Token-Address>`, you can use `0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa` which is a [token tracker for DAI](https://rinkeby.etherscan.io/address/0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea) used by Uniswap's implementation on Rinkeby. Please note the use of `'` and `"` in this command.

> This returns `Installed uniswap.open.aragonpm.eth at: <Uniswap-App-Proxy-Address>` for use in future commands.

### Configure the Agent app

In order for the Uniswap Aragon App to transact via the Agent, the following commands need to be run, to set the permissions on the Agent app:

```
dao acl create <DAO-Address> <Agent-App-Proxy-Address> EXECUTE_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> SAFE_EXECUTE_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> RUN_SCRIPT_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> TRANSFER_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

### Configure the Uniswap Aragon App

In order for all operations by Uniswap Aragon App to be governed by a vote, the following commands need to be run:

```
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> ETH_TOKEN_SWAP_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> TRANSFER_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_UNISWAP_TOKENS_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_UNISWAP_FACTORY_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_AGENT_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

You can now visit the DAO's Home page at https://rinkeby.aragon.org/#/<DAO-Address>

![Screenshot from 2019-09-06 18-54-24](https://user-images.githubusercontent.com/2212651/64445942-e6309380-d0d7-11e9-83ae-fb6118cf3dce.png)

You can also view the Uniswap App at https://rinkeby.aragon.org/#/<DAO-Address>/<Uniswap-App-Proxy-Address>

![Screenshot from 2019-09-06 18-53-06](https://user-images.githubusercontent.com/2212651/64445976-f5174600-d0d7-11e9-90d8-84b21b7bedc3.png)

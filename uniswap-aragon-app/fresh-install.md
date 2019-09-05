This script will use aragonCLI to:

- Create a new Aragon DAO on Rinkeby with token and basic apps
- Install the Uniswap Aragon App
- Set the Uniswap Aragon App's permissions as recommended

You must be running `aragon ipfs` in another window.

The following parameter is required to start this:

- `<Your-AragonCLI-Address>` = the address for the private key being used by your aragonCLI to sign transactions.

During this script, new addresses will be created which will be required for further commands.

### Create a new Aragon DAO on Rinkeby with token and basic apps

```
dao new --environment aragon:rinkeby
```

> This returns `Created DAO: <DAO-Address>` for use in future commands.

```
dao token new "UniswapDAOToken" "USDAO" 0 --environment aragon:rinkeby
```

> This returns `Successfully deployed the token at <DAO-Token-Address>` for use in future commands.

```
dao install <DAO-Address> token-manager --app-init none --environment aragon:rinkeby
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

> This returns the `<Token-Manager-Proxy-Address>` for use in future commands.

```
dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <Your-AragonCLI-Address> <Your-AragonCLI-Address> --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <Your-AragonCLI-Address> 1 --environment aragon:rinkeby
dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 250000000000000000 86400 --environment aragon:rinkeby
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

> This returns `<Voting-App-Proxy-Address>` for use in future commands.

```
dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

You have now created a basic app on Aragon, with a token and basic apps.

### Install the Aragon Agent App

The Agent App is an application which acts on behalf of the DAO. The Uniswap Aragon App will transact via this application.

```
dao install <DAO-Address> agent --environment aragon:rinkeby
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

> This returns the `Proxy address` for an app named `0x9ac98dc5f995bf0211ed589ef022719d1487e5cb2bab505676f0d084c07cf89a` as the `<Agent-App-Proxy-Address>` for use in future commands.

### Install the Uniswap Aragon App

```
dao install <DAO-Address> uniswap.open.aragonpm.eth --app-init-args <Agent-App-Proxy-Address> <Uniswap-Factory-Address> ["'<Token-App-Address>'"] --environment aragon:rinkeby
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

> This returns  the `Proxy address` for an app named `0x6462a4eaf83a2a0ee0a82364882720a4a46a47ffb33daf1ea6ab2a7f88e192c9` as the `<Uniswap-App-Proxy-Address>` for use in future commands.

### Set the Agent App's permissions

In order for the Uniswap Aragon App to transact via the Agent, the following commands need to be run, to set the permissions on the Agent app:

```
dao acl create <DAO-Address> <Agent-App-Proxy-Address> EXECUTE_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> SAFE_EXECUTE_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> RUN_SCRIPT_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> TRANSFER_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

### Set the Uniswap Aragon App's permissions

```
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> ETH_TOKEN_SWAP_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> TRANSFER_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_UNISWAP_TOKENS_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_UNISWAP_FACTORY_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_AGENT_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

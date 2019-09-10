```
<AragonCLI-Address>

dao new --environment aragon:rinkeby

dao token new "UniswapDAOToken" "USDAO" 0 --environment aragon:rinkeby

<DAO-Address>

<DAO-Token-Address>

dao install <DAO-Address> token-manager --app-init none --environment aragon:rinkeby

<Token-Manager-Proxy-Address>

dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <AragonCLI-Address> <AragonCLI-Address> --environment aragon:rinkeby

dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby

dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <AragonCLI-Address> 1 --environment aragon:rinkeby

dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 500000000000000000 3600 --environment aragon:rinkeby

<Voting-App-Proxy-Address>

dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao install <DAO-Address> agent --environment aragon:rinkeby

<Agent-App-Proxy-Address>

dao install <DAO-Address> uniswap.open.aragonpm.eth --app-init-args <Agent-App-Proxy-Address> <Uniswap-Factory-Address> ["'<Swap-Token-Address>'"] --environment aragon:rinkeby

<Uniswap-Factory-Address> = 0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36

<Swap-Token-Address> = 0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa

<Uniswap-App-Proxy-Address>

dao acl create <DAO-Address> <Agent-App-Proxy-Address> EXECUTE_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Agent-App-Proxy-Address> SAFE_EXECUTE_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Agent-App-Proxy-Address> TRANSFER_ROLE <Uniswap-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> ETH_TOKEN_SWAP_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> TRANSFER_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_UNISWAP_TOKENS_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_UNISWAP_FACTORY_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <Uniswap-App-Proxy-Address> SET_AGENT_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

https://rinkeby.aragon.org/#/<DAO-Address>
```

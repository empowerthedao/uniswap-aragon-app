pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "@aragon/os/contracts/lib/token/ERC20.sol";
import "./UniswapFactoryInterface.sol";
import "./lib/AddressArrayUtils.sol";

contract Uniswap is AragonApp {

    using SafeERC20 for ERC20;
    using AddressArrayUtils for address[];

    /* Hardcoded constants to save gas
        bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
        bytes32 public constant SET_UNISWAP_FACTORY_ROLE = keccak256("SET_UNISWAP_FACTORY_ROLE");
        bytes32 public constant SET_UNISWAP_TOKENS_ROLE = keccak256("SET_UNISWAP_TOKENS_ROLE");
        bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
        bytes32 public constant ETH_TOKEN_SWAP_ROLE = keccak256("ETH_TOKEN_SWAP_ROLE");
        bytes32 public constant TOKEN_ETH_SWAP_ROLE = keccak256("TOKEN_ETH_SWAP_ROLE");
    */
    bytes32 public constant SET_AGENT_ROLE = 0xf57d195c0663dd0e8a2210bb519e2b7de35301795015198efff16e9a2be238c8;
    bytes32 public constant SET_UNISWAP_FACTORY_ROLE = 0x1427918e67b95e0cb260e596102ff0666f3c89b377e6665a5e1972610866cd4a;
    bytes32 public constant SET_UNISWAP_TOKENS_ROLE = 0xb2ab98dbddb559eefe61173785a1b86a93c1ec3301da590c6d02a026f1eb0dcd;
    bytes32 public constant TRANSFER_ROLE = 0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c;
    bytes32 public constant ETH_TOKEN_SWAP_ROLE = 0xef9bd5cfaa4a8d7047e868d9b606a8b2248d5f17ac8024114ade2dd3c942657a;
    bytes32 public constant TOKEN_ETH_SWAP_ROLE = 0x1cb6048a80a6d531b3f95fdcb823d65667b81930d49614eadff9716067f29a09;

    string private constant ERROR_TOO_MANY_TOKENS = "UNISWAP_TOO_MANY_TOKENS";
    string private constant ERROR_NOT_CONTRACT = "UNISWAP_NOT_CONTRACT";
    string private constant ERROR_TOKEN_ALREADY_ADDED = "UNISWAP_ERROR_TOKEN_ALREADY_ADDED";
    string private constant ERROR_CAN_NOT_DELETE_TOKEN = "UNISWAP_CAN_NOT_DELETE_TOKEN";
    string private constant ERROR_VALUE_MISMATCH = "UNISWAP_VALUE_MISMATCH";
    string private constant ERROR_SEND_REVERTED = "UNISWAP_SEND_REVERTED";
    string private constant ERROR_TOKEN_TRANSFER_FROM_REVERTED = "UNISWAP_TOKEN_TRANSFER_FROM_REVERTED";
    string private constant ERROR_TOKEN_NOT_ENABLED = "UNISWAP_TOKEN_NOT_ENABLED";
    string private constant ERROR_TOKEN_APPROVE_REVERTED = "UNISWAP_TOKEN_APPROVE_REVERTED";
    string private constant ERROR_NO_EXCHANGE_FOR_TOKEN = "UNISWAP_NO_EXCHANGE_FOR_TOKEN";

    uint256 private constant MAX_ENABLED_TOKENS = 100;

    Agent public agent;
    UniswapFactoryInterface public uniswapFactory;
    address[] public enabledTokens;

    event AppInitialized();
    event NewAgentSet(address agent);
    event NewUniswapFactorySet(address factory);
    event TokenEnabled(address token);
    event TokenDisabled(address token);
    event EthToTokenSwapInput(address tokenTransferred);
    event TokenToEthSwapInput(address tokenTransferred);

    modifier tokenIsEnabled(address _token) {
        require(enabledTokens.contains(_token), ERROR_TOKEN_NOT_ENABLED);
        _;
    }

    /**
    * @notice Initialize the Uniswap App
    * @param _agent The Agent contract address
    * @param _uniswapFactory The Uniswap Factory contract address
    * @param _enabledTokens An array of enabled tokens, should not contain duplicates
    */
    function initialize(Agent _agent, UniswapFactoryInterface _uniswapFactory, address[] _enabledTokens) external onlyInit {
        require(_enabledTokens.length <= MAX_ENABLED_TOKENS, ERROR_TOO_MANY_TOKENS);
        require(isContract(address(_agent)), ERROR_NOT_CONTRACT);
        require(isContract(address(_uniswapFactory)), ERROR_NOT_CONTRACT);

        for (uint256 enabledTokenIndex = 0; enabledTokenIndex < _enabledTokens.length; enabledTokenIndex++) {
            address exchangeAddress = _uniswapFactory.getExchange(_enabledTokens[enabledTokenIndex]);
            require(exchangeAddress != address(0), ERROR_NO_EXCHANGE_FOR_TOKEN);
        }

        agent = _agent;
        uniswapFactory = _uniswapFactory;
        enabledTokens = _enabledTokens;

        initialized();

        emit AppInitialized();
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(Agent _agent) external auth(SET_AGENT_ROLE) {
        require(isContract(address(_agent)), ERROR_NOT_CONTRACT);

        agent = _agent;
        emit NewAgentSet(address(_agent));
    }

    /**
    * @notice Update the Uniswap Factory address to `_uniswapFactory`
    * @param _uniswapFactory New Uniswap Factory address
    */
    function setUniswapFactory(UniswapFactoryInterface _uniswapFactory) external auth(SET_UNISWAP_FACTORY_ROLE) {
        require(isContract(address(_uniswapFactory)), ERROR_NOT_CONTRACT);

        uniswapFactory = _uniswapFactory;
        emit NewUniswapFactorySet(address(_uniswapFactory));
    }

    /**
    * @notice Enable the Uniswap exchange for token `_token`
    * @param _token Token to enable
    */
    function enableToken(address _token) public auth(SET_UNISWAP_TOKENS_ROLE) {
        require(enabledTokens.length < MAX_ENABLED_TOKENS, ERROR_TOO_MANY_TOKENS);
        require(!enabledTokens.contains(_token), ERROR_TOKEN_ALREADY_ADDED);

        address exchangeAddress = uniswapFactory.getExchange(_token);
        require(exchangeAddress != address(0), ERROR_NO_EXCHANGE_FOR_TOKEN);

        enabledTokens.push(_token);
        emit TokenEnabled(_token);
    }

    /**
    * @notice Disable the Uniswap exchange for token `_token`
    * @param _token Token to disable
    */
    function disableToken(address _token) public auth(SET_UNISWAP_TOKENS_ROLE) {
        require(enabledTokens.deleteItem(_token), ERROR_CAN_NOT_DELETE_TOKEN);
        emit TokenDisabled(_token);
    }

    function getEnabledTokens() public view returns (address[]) {
        return enabledTokens;
    }

    /**
    * @notice Deposit `@tokenAmount(_token, _value, true, 18)` to the Uniswap App's Agent
    * @param _token Address of the token being transferred
    * @param _value Amount of tokens being transferred
    */
    function deposit(address _token, uint256 _value) external payable isInitialized nonReentrant {
        if (_token == ETH) {
            // Can no longer use 'send()' due to EIP-1884 so we use 'call.value()' with a reentrancy guard instead
            (bool success, ) = address(agent).call.value(_value)();
            require(success, ERROR_SEND_REVERTED);
        } else {
            require(ERC20(_token).safeTransferFrom(msg.sender, address(this), _value), ERROR_TOKEN_TRANSFER_FROM_REVERTED);
            require(ERC20(_token).safeApprove(address(agent), _value), ERROR_TOKEN_APPROVE_REVERTED);
            agent.deposit(_token, _value);
        }
    }

    /**
    * @notice Transfer `@tokenAmount(_token, _value, true, 18)` from the Uniswap's Agent to `_to`
    * @param _token Address of the token being transferred
    * @param _to Address of the recipient of tokens
    * @param _value Amount of tokens being transferred
    */
    function transfer(address _token, address _to, uint256 _value) external auth(TRANSFER_ROLE) {
        agent.transfer(_token, _to, _value);
    }

    /**
    * @notice Swap `@tokenAmount(0x0000000000000000000000000000000000000000, _ethAmount)` for at least `@tokenAmount(_token, _minTokenAmount, true, 18)`. Expiring at `@formatDate(_expiredAtTime, 'MMMM do, h:mma')`
    * @param _token Address of the token to swap ETH for
    * @param _ethAmount Amount of ETH to exchange for the token specified
    * @param _minTokenAmount Minimum amount of tokens to be exchanged for
    * @param _expiredAtTime Time from which the transaction will be considered invalid
    */
    function ethToTokenSwapInput(address _token, uint256 _ethAmount, uint256 _minTokenAmount, uint256 _expiredAtTime)
        external
        tokenIsEnabled(_token)
        auth(ETH_TOKEN_SWAP_ROLE)
    {
        address exchangeAddress = uniswapFactory.getExchange(_token);
        require(exchangeAddress != address(0), ERROR_NO_EXCHANGE_FOR_TOKEN);

        bytes memory encodedFunctionCall = abi.encodeWithSignature("ethToTokenSwapInput(uint256,uint256)", _minTokenAmount, _expiredAtTime);
        agent.execute(exchangeAddress, _ethAmount, encodedFunctionCall);

        emit EthToTokenSwapInput(_token);
    }

    /**
    * @notice Swap `@tokenAmount(_token, _tokenAmount, true, 18)` for at least `@tokenAmount(0x0000000000000000000000000000000000000000, _minEthAmount)`. Expiring at `@formatDate(_expiredAtTime, 'MMMM do, h:mma')`
    * @param _token Address of the token to swap ETH for
    * @param _tokenAmount Amount of tokens to exchange for Eth amount specified
    * @param _minEthAmount Minimum amount of Eth to be exchanged for
    * @param _expiredAtTime Time from which the transaction will be considered invalid
    */
    function tokenToEthSwapInput(address _token, uint256 _tokenAmount, uint256 _minEthAmount, uint256 _expiredAtTime)
        external
        tokenIsEnabled(_token)
        auth(TOKEN_ETH_SWAP_ROLE)
    {
        address exchangeAddress = uniswapFactory.getExchange(_token);
        require(exchangeAddress != address(0), ERROR_NO_EXCHANGE_FOR_TOKEN);

        bytes memory approveFunctionCall = abi.encodeWithSignature("approve(address,uint256)", exchangeAddress, _tokenAmount);
        agent.safeExecute(_token, approveFunctionCall);

        bytes memory encodedFunctionCall = abi.encodeWithSignature("tokenToEthSwapInput(uint256,uint256,uint256)", _tokenAmount, _minEthAmount, _expiredAtTime);
        agent.safeExecute(exchangeAddress, encodedFunctionCall);

        emit TokenToEthSwapInput(_token);
    }

}
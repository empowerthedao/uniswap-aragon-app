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

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant SET_UNISWAP_FACTORY_ROLE = keccak256("SET_UNISWAP_FACTORY_ROLE");
    bytes32 public constant SET_UNISWAP_TOKENS_ROLE = keccak256("SET_UNISWAP_TOKENS_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 public constant ETH_TOKEN_SWAP_ROLE = keccak256("ETH_TOKEN_SWAP_ROLE");

    string private constant ERROR_TOO_MANY_TOKENS = "UNISWAP_TOO_MANY_TOKENS";
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
    */
    function initialize(address _agent, address _uniswapFactory, address[] _enabledTokens) external onlyInit {
        require(_enabledTokens.length < MAX_ENABLED_TOKENS, ERROR_TOO_MANY_TOKENS);

        agent = Agent(_agent);
        uniswapFactory = UniswapFactoryInterface(_uniswapFactory);
        enabledTokens = _enabledTokens;

        for (uint256 enabledTokenIndex = 0; enabledTokenIndex < _enabledTokens.length; enabledTokenIndex++) {
            address exchangeAddress = uniswapFactory.getExchange(_enabledTokens[enabledTokenIndex]);
            require(exchangeAddress != address(0), ERROR_NO_EXCHANGE_FOR_TOKEN);
        }

        initialized();

        emit AppInitialized();
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(address _agent) external auth(SET_AGENT_ROLE) {
        agent = Agent(_agent);
        emit NewAgentSet(_agent);
    }

    /**
    * @notice Update the Uniswap Factory address to `_uniswapFactory`
    * @param _uniswapFactory New Uniswap Factory address
    */
    function setUniswapFactory(address _uniswapFactory) external auth(SET_UNISWAP_FACTORY_ROLE) {
        uniswapFactory = UniswapFactoryInterface(_uniswapFactory);
        emit NewUniswapFactorySet(_uniswapFactory);
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
    function deposit(address _token, uint256 _value) external payable {
        if (_token == ETH) {
            require(agent.send(_value), ERROR_SEND_REVERTED);
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
    /* solium-disable-next-line function-order */
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
    auth(ETH_TOKEN_SWAP_ROLE)
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
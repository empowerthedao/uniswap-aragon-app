pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "@aragon/os/contracts/lib/token/ERC20.sol";
import "./UniswapFactoryInterface.sol";
import "./UniswapExchangeInterface.sol";

contract Uniswap is AragonApp {

    using SafeERC20 for ERC20;

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant SET_UNISWAP_FACTORY = keccak256("SET_UNISWAP_FACTORY");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 public constant ETH_TOKEN_SWAP_ROLE = keccak256("ETH_TOKEN_SWAP_ROLE");

    string private constant ERROR_VALUE_MISMATCH = "UNISWAP_VALUE_MISMATCH";
    string private constant ERROR_SEND_REVERTED = "UNISWAP_SEND_REVERTED";
    string private constant ERROR_TOKEN_TRANSFER_FROM_REVERTED = "UNISWAP_TOKEN_TRANSFER_FROM_REVERTED";
    string private constant ERROR_TOKEN_APPROVE_REVERTED = "UNISWAP_TOKEN_APPROVE_REVERTED";
    string private constant ERROR_NO_EXCHANGE_FOR_TOKEN = "UNISWAP_NO_EXCHANGE_FOR_TOKEN";

    Agent public agent;
    UniswapFactoryInterface public uniswapFactory;

    event AppInitialized();
    event NewAgentSet();
    event NewUniswapFactorySet();
    event EthToTokenSwapInput(address tokenReturned);

    /**
    * @notice Initialize the Uniswap App
    * @param _agent The Agent contract address
    */
    function initialize(address _agent, address _uniswapFactory) external onlyInit {
        initialized();
        agent = Agent(_agent);
        uniswapFactory = UniswapFactoryInterface(_uniswapFactory);
        emit AppInitialized();
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(address _agent) external auth(SET_AGENT_ROLE) {
        agent = Agent(_agent);
        emit NewAgentSet();
    }

    /**
    * @notice Update the Uniswap Factory address to `_uniswapFactory`
    * @param _uniswapFactory New Uniswap Factory address
    */
    function setUniswapFactory(address _uniswapFactory) external auth(SET_UNISWAP_FACTORY) {
        uniswapFactory = UniswapFactoryInterface(_uniswapFactory);
        emit NewUniswapFactorySet();
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
    auth(ETH_TOKEN_SWAP_ROLE)
    {
        address exchangeAddress = uniswapFactory.getExchange(_token);
        require(exchangeAddress != address(0), ERROR_NO_EXCHANGE_FOR_TOKEN);

        bytes memory encodedFunctionCall = abi.encodeWithSignature("ethToTokenSwapInput(uint256,uint256)", _minTokenAmount, _expiredAtTime);

        emit EthToTokenSwapInput(_token);

        agent.execute(exchangeAddress, _ethAmount, encodedFunctionCall);
    }
}
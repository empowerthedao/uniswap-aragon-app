pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "@aragon/os/contracts/lib/token/ERC20.sol";

contract Uniswap is AragonApp {

    using SafeERC20 for ERC20;

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");

    string private constant ERROR_VALUE_MISMATCH = "UNISWAP_VALUE_MISMATCH";
    string private constant ERROR_SEND_REVERTED = "UNISWAP_SEND_REVERTED";
    string private constant ERROR_TOKEN_TRANSFER_FROM_REVERTED = "UNISWAP_TOKEN_TRANSFER_FROM_REVERTED";
    string private constant ERROR_TOKEN_APPROVE_REVERTED = "UNISWAP_TOKEN_APPROVE_REVERTED";

    Agent public agent;

    event AppInitialized();
    event NewAgentSet();

    /**
    * @notice Initialize the Uniswap App
    * @param _agent The Agent contract address
    */
    function initialize(address _agent) public {
        initialized();
        agent = Agent(_agent);
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
    * @notice Deposit `@tokenAmount(_token, _value, true, 18)` `_token` tokens to the Uniswap App
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
    * @notice Transfer `@tokenAmount(_token, _value, true, 18)` `_token` from the Uniswap Agent to `_to`
    * @param _token Address of the token being transferred
    * @param _to Address of the recipient of tokens
    * @param _value Amount of tokens being transferred
    */
    /* solium-disable-next-line function-order */
    function transfer(address _token, address _to, uint256 _value) external auth(TRANSFER_ROLE) {
        agent.transfer(_token, _to, _value);
    }
}
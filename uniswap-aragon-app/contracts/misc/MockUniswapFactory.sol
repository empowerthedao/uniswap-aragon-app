pragma solidity ^0.4.24;

import "../UniswapFactoryInterface.sol";

contract MockUniswapFactory is UniswapFactoryInterface {

    address exchange;

    constructor(address _exchange) public {
        exchange = _exchange;
    }

    function getExchange(address _token) public view returns (address) {
        return exchange;
    }
}

pragma solidity ^0.4.24;

contract UniswapFactoryInterface {

    function getExchange(address _token) public view returns (address);
}

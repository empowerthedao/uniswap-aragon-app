pragma solidity ^0.4.24;

contract UniswapExchangeInterface {

    function getEthToTokenInputPrice(uint256 eth_sold) returns (uint256);

    function getEthToTokenOutputPrice(uint256 tokens_bought) returns (uint256);
}

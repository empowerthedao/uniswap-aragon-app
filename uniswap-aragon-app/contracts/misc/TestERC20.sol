pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

contract TestERC20 is MintableToken, DetailedERC20("Decentraland", "DNT", 18) {

    constructor() public {
        mint(msg.sender, 1000 * (10**18));
    }
}

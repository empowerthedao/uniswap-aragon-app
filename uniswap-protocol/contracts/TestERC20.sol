pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract TestERC20 is ERC20Mintable, ERC20Detailed("Decentraland", "DNT", 18) {

    constructor() public {
        mint(msg.sender, 1000000 * (10**18));
    }
}

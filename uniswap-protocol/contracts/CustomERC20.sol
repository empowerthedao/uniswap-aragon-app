pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract CustomERC20 is ERC20Mintable, ERC20Detailed {

    constructor(string memory _tokenName, string memory _tokenSymbol)
    ERC20Detailed(_tokenName, _tokenSymbol, 18)
    public
    {
        mint(msg.sender, 1000000 * (10**18));
    }
}

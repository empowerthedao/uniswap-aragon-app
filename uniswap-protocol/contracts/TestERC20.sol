pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract TestERC20 is ERC20Mintable, ERC20Detailed("Decentraland", "DNT", 18) {

    constructor() public {
        mint(msg.sender, 1000000 * (10**18));
    }

    // Uncomment the below and delete the inherited ERC20Detailed contract to test the nonconformant ERC20 DAI token.
//    /**
//     * @dev Returns the name of the token.
//     */
//    function name() public view returns (bytes32) {
//        return 0x44616920537461626c65636f696e2076312e3000000000000000000000000000;
//    }
//
//    /**
//     * @dev Returns the symbol of the token, usually a shorter version of the
//     * name.
//     */
//    function symbol() public view returns (bytes32) {
//        return 0x4441490000000000000000000000000000000000000000000000000000000000;
//    }
//
//    function decimals() public view returns (uint8) {
//        return 18;
//    }

}

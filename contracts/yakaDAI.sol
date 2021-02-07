pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract yakaDAI is ERC20, AccessControl {

    bytes32 public constant MINTBURN_ROLE = keccak256("MINTBURN_ROLE");

    using SafeMath for uint256;
    
    constructor() ERC20("yakaDAI", "yakaDAI") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MINTBURN_ROLE, DEFAULT_ADMIN_ROLE);
    }
    
    ////////////////////////////////////// MINT/BURN ////////////////////////////////////// 

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTBURN_ROLE, msg.sender));
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        require(hasRole(MINTBURN_ROLE, msg.sender));
        _burn(from, amount);
    }
    
    ///////////////////////////////////////// END ///////////////////////////////////////// 

    ///////////////////////////////////////////////////////// Funtions to delete /////////////////////////////////////////////////////
}







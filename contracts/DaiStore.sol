pragma solidity ^0.7.0;


import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./yakaDAI.sol";

contract DaiStore is AccessControl {
    
    using SafeMath for uint256;
    
    address constant internal DaiAddress = 0xBB949c7053F2042F6F67C8F49E547727DF5Ab378; // DAI Address  
    address constant internal yakaDAIAddress = 0xb1a13206ded81745CAf75d1B30e403Ae5e20A959; // yakaDAI Address
    
    ERC20 constant internal dai = ERC20(DaiAddress);
    yakaDAI constant internal yakadai = yakaDAI(yakaDAIAddress);
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    event DAIDeposited(address _client, uint256 _amount);
    event YakaDAIDeposited(address _client, uint256 _amount);
    
    function depositDAI() public {
        uint tokenAmount = dai.allowance(msg.sender, address(this));
        require(tokenAmount > 0);
        require(dai.transferFrom(msg.sender, address(this), tokenAmount));
        emit DAIDeposited(msg.sender, tokenAmount);
        yakadai.mint(msg.sender, tokenAmount);
    }
    
    function depositYakaDAI() public returns (bool success) {
        uint tokenAmount = yakadai.allowance(msg.sender, address(this));
        require(tokenAmount > 0);
        
        //////////////////////////// //////////////////////////////////////////////////
        /////// Fer el que sigui amb els DAI per tenirlo aqui per enviar usuari ///////
        //////////////////////////// //////////////////////////////////////////////////
        
        require(yakadai.transferFrom(msg.sender, address(this), tokenAmount));
        yakadai.burn(address(this), tokenAmount);
        emit YakaDAIDeposited(msg.sender, tokenAmount);
        dai.transfer(msg.sender, tokenAmount);
        return true;
    }
    
    function depositYakaDAI_improving(uint nburnedTokens) public returns (bool success) {
        require(yakadai.balanceOf(msg.sender) > nburnedTokens);
        
        //////////////////////////// //////////////////////////////////////////////////
        /////// Fer el que sigui amb els DAI per tenirlo aqui per enviar usuari ///////
        //////////////////////////// //////////////////////////////////////////////////
        
        yakadai.burn(msg.sender, nburnedTokens);
        dai.transfer(msg.sender, nburnedTokens);
        return true;
    }
    
    function DAIallowance(address a) public view returns (uint) {
        return dai.allowance(a, address(this));
    }
    
    function yakaDAIallowance(address a) public view returns (uint) {
        return yakadai.allowance(a, address(this));
    }
    
    function withdrawDAI(address a, uint tokenAmount) public returns (bool success) {
        require(hasRole(WITHDRAW_ROLE, msg.sender));
        dai.transfer(a, tokenAmount);
        return false;
    }
    
    function DAIassets() public view returns (uint256) {
        return dai.balanceOf(address(this));
    }
    
    function yakaDAIassets() public view returns (uint256) {
        return yakadai.balanceOf(address(this));
    }
    
    function storeETH() payable public {}
    
    function withdrawETH(address payable a, uint256 amount) public {
        require(hasRole(WITHDRAW_ROLE, msg.sender));
        require(amount <= getBalanceETH());
        a.transfer(amount);
    }
    
    function getBalanceETH() public view returns (uint256) {
        return address(this).balance;
    } 
}

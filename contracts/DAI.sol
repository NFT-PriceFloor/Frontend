pragma solidity ^0.7.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}


contract DAI is IERC20 {

    string public constant name_ = "DAI";
    string public constant symbol_ = "DAI";
    uint8 public constant decimals_ = 18;

    address test = 0xeb4305da6Cf54D8F0E5203Ae6363F2783D653C28;
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalSupply_ = 1000*(10**18);
    using SafeMath for uint256;

    constructor() {
        balances[msg.sender] = totalSupply_-(100*(10**18));
        balances[test] = 100*(10**18); // to test
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    function decimals() public pure returns (uint8) {
        return decimals_;
    }

    function symbol() public pure returns (string memory) {
        return symbol_;
    }

    function name() public pure returns (string memory) {
        return name_;
    }
    
    function buyMyAddress() public payable {
        uint toMint = msg.value*(10**18);
        totalSupply_ += toMint;
        balances[msg.sender] += toMint;
    }
    
    function buyTo(address a) public payable {
        uint toMint = msg.value*(10**18);
        totalSupply_ += toMint;
        balances[a] += toMint;
    }
}



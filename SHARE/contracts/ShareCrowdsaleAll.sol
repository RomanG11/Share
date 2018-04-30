pragma solidity ^0.4.20;

//standard library for uint
library SafeMath { 
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0 || b == 0){
        return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }

  function pow(uint256 a, uint256 b) internal pure returns (uint256){ //power function
    if (b == 0){
      return 1;
    }
    uint256 c = a**b;
    assert (c >= a);
    return c;
  }
}

//standard contract to identify owner
contract Ownable {

  address public owner;

  address public newOwner;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
  function transferOwnership(address _newOwner) public onlyOwner {
    require(_newOwner != address(0));
    newOwner = _newOwner;
  }

  function acceptOwnership() public {
    if (msg.sender == newOwner) {
      owner = newOwner;
    }
  }
}
//Abstract Token contract
contract SHAREToken{
  function setCrowdsaleContract (address) public;
  function sendCrowdsaleTokens(address, uint256)  public;
}

//Crowdsale contract
contract ShareCrowdsale is Ownable{

  using SafeMath for uint;

  uint decimals = 2;

  // Token contract address
  SHAREToken public token;

  uint public tokenPrice = 1650; // 1ETH = 1650 Tokens

  address public distributionAddress;

  // Constructor
  function ShareCrowdsale(address _tokenAddress, address _distribution) public {
    token = SHAREToken(_tokenAddress);
    owner = msg.sender;

    distributionAddress = _distribution;

    setupStages();

    token.setCrowdsaleContract(this);    
  }

  uint public constant PRE_ICO_START = 0;//1522540860; //04/01/2018 12:01:00 AM GMT
  uint public constant PRE_ICO_FINISH = 1554163140; //04/01/2019 11:59:00 PM GMT

  uint public constant PRE_ICO_MAX_CAP = 6000 ether;

  uint public constant ICO_START = 1559347260; //06/01/2019 12:01:00 AM GMT
  uint public constant ICO_FINISH = 1591055940; //06/01/2020 11:59:00 PM GMT

  uint public tokensSold;
  uint public ethCollected;

  uint public constant MIN_DEPOSIT = 0.01 ether;

  struct Stage {
    uint tokensPrice;
    uint tokensDistribution;
    uint discount;
    bool isActive;
  }
  
  Stage[] public preIcoStages;
  Stage[] public icoStages;

  function setupStages () internal {
    preIcoStages.push(Stage(1650,250000000, 10000, true));
    preIcoStages.push(Stage(1650,500000000, 5000, true));
    preIcoStages.push(Stage(1650,800000000, 3500, true));

    icoStages.push(Stage(1650,1000000000, 2500, true));
    icoStages.push(Stage(1650,1500000000, 1800, true));
    icoStages.push(Stage(1650,1500000000, 1200, true));
    icoStages.push(Stage(1650,1500000000, 600, true));
    icoStages.push(Stage(1650,4950000000, 0, true)); 
  }
  
  function stopPreIcoPhase (uint _phase) external onlyOwner {
    preIcoStages[_phase].isActive = false;
  }

  function stopIcoPhase (uint _phase) external onlyOwner {
    icoStages[_phase].isActive = false;
  }

  function startPreIcoPhase (uint _phase) external onlyOwner {
    preIcoStages[_phase].isActive = true;
  }

  function startIcoPhase (uint _phase) external onlyOwner {
    icoStages[_phase].isActive = true;
  }

  function changePreIcoStageTokenPrice (uint _phase, uint _tokenPrice) external onlyOwner {
    preIcoStages[_phase].tokensPrice = _tokenPrice;
  }
  
  function changeIcoStageTokenPrice (uint _phase, uint _tokenPrice) external onlyOwner {
    icoStages[_phase].tokensPrice = _tokenPrice;
  }
  
  function () public payable {
    require (isPreIco() || isIco());
    require (msg.value >= MIN_DEPOSIT);
    require (buy(msg.sender, msg.value));
  }

  function buy (address _address, uint _value) internal returns(bool) {
    bool isIcoNow = isIco();
    uint currentStage = getCurrentStage();
    if (currentStage == 100){
      return false;
    }
    
    // uint tokensToSend = _value.mul(tokenPrice)/(uint(10).pow(uint(14))); //decimals difference
    if (!isIcoNow){
      uint _phasePrice = preIcoStages[currentStage].tokensPrice;
      uint _tokenPrice = _phasePrice.add(_phasePrice.mul(preIcoStages[currentStage].discount)/10000);
      uint tokensToSend = _value.mul(_tokenPrice)/(uint(10).pow(uint(16))); //decimals difference
    //   tokensToSend = tokensToSend.add(tokensToSend.mul(preIcoStages[currentStage].bonus)/100);
    }else{
    //   tokensToSend = tokensToSend.add(tokensToSend.mul(icoStages[currentStage].bonus)/100);
      _phasePrice = icoStages[currentStage].tokensPrice;
      _tokenPrice = _phasePrice.add(_phasePrice.mul(icoStages[currentStage].discount)/10000);
      tokensToSend = _value.mul(_tokenPrice)/(uint(10).pow(uint(16))); //decimals difference
    }

    token.sendCrowdsaleTokens(_address,tokensToSend);
    
    tokensSold = tokensSold.add(tokensToSend);
    ethCollected += _value;
    distributionAddress.transfer(address(this).balance);
    return true;
  }

  function getCurrentStage () public view returns(uint) {
    require (isPreIco() || isIco());
    uint buffer;

    if(isPreIco()){
      for (uint i = 0; i < preIcoStages.length; i++){
        buffer += preIcoStages[i].tokensDistribution;
        if(tokensSold <= buffer && preIcoStages[i].isActive){
          return i;
        }
      }
    }

    if(isIco()){
      for (i = 0; i < icoStages.length; i++){
        buffer += icoStages[i].tokensDistribution;
        if(tokensSold <= buffer && preIcoStages[i].isActive){
          return i;
        }
      }
    }
    return 100; //something went wrong
  }

  function isPreIco () public view returns(bool) {
    if(PRE_ICO_START <= now && now <= PRE_ICO_FINISH){
      return true;
    }
    return false;
  }

  function  isIco() public view returns(bool) {
    if(ICO_START <= now && now <= ICO_FINISH){
      return true;
    }
    return false;
  }

  function sendCrowdsaleTokensManually (address _address, uint _value) external onlyOwner {
    token.sendCrowdsaleTokens(_address,_value);
    tokensSold = tokensSold.add(_value);
  }

  //if something went wrong
  function sendEtherManually () public onlyOwner {
    distributionAddress.transfer(address(this).balance);
  }
}

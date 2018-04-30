pragma solidity ^0.4.20;
import "./Ownable.sol";
import "./SafeMath.sol";

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

  struct Stage {
    uint tokensDistribution;
    uint bonus;
  }
  
  Stage[] public preIcoStages;
  Stage[] public icoStages;

  function setupStages () internal {
    preIcoStages.push(Stage(2500000, 100));
    preIcoStages.push(Stage(5000000, 50));
    preIcoStages.push(Stage(8000000, 35));

    icoStages.push(Stage(10000000, 25));
    icoStages.push(Stage(15000000, 18));
    icoStages.push(Stage(15000000, 12));
    icoStages.push(Stage(15000000, 6));
    icoStages.push(Stage(49500000, 0)); 
  }
  
  function () public payable {
    require (isPreIco() || isIco());
    require (buy(msg.sender, msg.value));
    
  }

  function buy (address _address, uint _value) internal returns(bool) {
    bool isIcoNow = isIco();
    uint currentStage = getCurrentStage();

    uint tokensToSend = _value.mul(tokenPrice)/(uint(10).pow(uint(14))); //decimals difference
    if (!isIcoNow){
      tokensToSend = tokensToSend.add(tokensToSend.mul(preIcoStages[currentStage].bonus)/100);
    }else{
      tokensToSend = tokensToSend.add(tokensToSend.mul(icoStages[currentStage].bonus)/100);
    }

    token.sendCrowdsaleTokens(_address,tokensToSend);

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
        if(tokensSold <= buffer){
          return i;
        }
      }
    }

    if(isIco()){
      for (i = 0; i < icoStages.length; i++){
        buffer += icoStages[i].tokensDistribution;
        if(tokensSold <= buffer){
          return i;
        }
      }
    }
    return 100; //something went wrong
  }

  function isPreIco () internal view returns(bool) {
    if(PRE_ICO_START <= now && now <= PRE_ICO_FINISH){
      return true;
    }
    return false;
  }

  function  isIco() internal view returns(bool) {
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
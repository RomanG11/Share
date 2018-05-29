window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //return a message that metamask is not present!!
    }

    startApp();
})

var is_ico_check = $.Deferred();
var is_pre_ico_check = $.Deferred();
var current_stage_check = $.Deferred();

function startApp() {
    //checking Main net 
    web3.version.getNetwork(function(err, netId){
        // console.log(netId);
        if(netId !== "1"){
            //net ID must be 1; Show any message
        }
    });

    // var ethAddr = web3js.eth.defaultAccount;

    if( web3js.eth.defaultAccount === undefined ){
        // $('#metamaskCheck').css('display', 'block');
        // Metamask is not active. Show any message
    }

    TokenContract = web3js.eth.contract(tokenAbi);
    TokenInstance = TokenContract.at("0x6daa9c353403b07386ba565426bdbbb57c987b81");

    CrowdsaleContract = web3js.eth.contract(crowdsaleAbi);
    CrowdsaleInstance = CrowdsaleContract.at("0x6d0010eed31aae932ae660479ce19b939d4a52f2");//PUT YOUR ADDRESS


    isIco();
    isPreIco();
    getCurrentStage();
    getSoldTokens();
    getCollectedEth();
    
    getIcoStage(0);
    getIcoStage(1);
    getIcoStage(2);
    getIcoStage(3);
    getIcoStage(4);
    getIcoStage(5);
    getIcoStage(6);
    getIcoStage(7);


    getTeamTokens();
    getBountyTokens();
    getPlatformTokens();
    getFoundersTokens();
    getAdvisorsTokens();

    getCurrentLockedTransfer();

    $('#token_addr').text("0x6daa9c353403b07386ba565426bdbbb57c987b81");
    $('#crowds_addr').text("0x6d0010eed31aae932ae660479ce19b939d4a52f2");
}

$.when(is_ico_check, is_pre_ico_check, current_stage_check).done(function(ico, pre_ico, stage){
  if(is_ico === 'false' && is_pre_ico === 'false'){
  $('#currentPhase').text('No active ICO phase');
  }
  if(is_ico === 'true'){
    $('#currentPhase').text('ICO');
    CrowdsaleInstance.icoStages(stage*1, function(err,result){
      if(!err){
        $('#currentPrice').text(result[0].toString());
      }else
        console.log(err)
    })
  }
  if(is_pre_ico === 'true'){
    $('#currentPhase').text('pre ICO');
    CrowdsaleInstance.preIcoStages(stage*1, function(err,result){
      if(!err){
        $('#currentPrice').text(result[0].toString());
      }else
        console.log(err)
    })
  }
  $('#currentStage').text(stage*1 + 1);
});


var tokenAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "platformReferralBalance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "crowdsaleContract",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "sendTeamBalance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "tokenHolder",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "crowdsaleBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_request",
          "type": "bool"
        }
      ],
      "name": "changeLockTransfer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "advisorsBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "setCrowdsaleContract",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "sendFoundersBalance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "burnTokens",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "acceptOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "foundersBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "teamBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "burnUnsoldTokens",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "sendCrowdsaleTokens",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "sendAdvisorsBalance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "locked",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "bountyBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "newOwner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "remaining",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "platformReferral",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "sendBountyBalance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_tokenHolder",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    }
]

var crowdsaleAbi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_phase",
          "type": "uint256"
        }
      ],
      "name": "startIcoPhase",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "icoStages",
      "outputs": [
        {
          "name": "tokensPrice",
          "type": "uint256"
        },
        {
          "name": "tokensDistribution",
          "type": "uint256"
        },
        {
          "name": "discount",
          "type": "uint256"
        },
        {
          "name": "isActive",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "ICO_FINISH",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "distributionAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "tokensSold",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "sendCrowdsaleTokensManually",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "preIcoStages",
      "outputs": [
        {
          "name": "tokensPrice",
          "type": "uint256"
        },
        {
          "name": "tokensDistribution",
          "type": "uint256"
        },
        {
          "name": "discount",
          "type": "uint256"
        },
        {
          "name": "isActive",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_phase",
          "type": "uint256"
        }
      ],
      "name": "stopIcoPhase",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "acceptOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "tokenPrice",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_phase",
          "type": "uint256"
        },
        {
          "name": "_tokenPrice",
          "type": "uint256"
        }
      ],
      "name": "changePreIcoStageTokenPrice",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_phase",
          "type": "uint256"
        }
      ],
      "name": "startPreIcoPhase",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "PRE_ICO_MAX_CAP",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_phase",
          "type": "uint256"
        },
        {
          "name": "_tokenPrice",
          "type": "uint256"
        }
      ],
      "name": "changeIcoStageTokenPrice",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "PRE_ICO_FINISH",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "sendEtherManually",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isPreIco",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "ethCollected",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "ICO_START",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "PRE_ICO_START",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "newOwner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "MIN_DEPOSIT",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getCurrentStage",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_phase",
          "type": "uint256"
        }
      ],
      "name": "stopPreIcoPhase",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isIco",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "name": "_distribution",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    }
  ]

function isPreIco() {
  CrowdsaleInstance.isPreIco(function (err, result) {
        if(!err){
            // console.log(result)
            is_pre_ico = result.toString();
            is_pre_ico_check.resolve(result.toString());
        }
        else
            console.log(err)
    })
}

function isIco() {
  CrowdsaleInstance.isIco(function (err, result) {
        if(!err){
            // console.log(result)
            is_ico = result.toString();
            is_ico_check.resolve("result.toString()");
            // return result;
        }
        else
            console.log(err)
    })
}

function getIcoStage(index) {
	CrowdsaleInstance.icoStages(index, function (err, result) {
    if(!err){
      // console.log(result)
      if(index === 0){
      $('#token_price1').text(result[0].toString());
      $('#max_cap1').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount1').text(result[2].toString()/100);
      $('#status1').text(result[3].toString());
    }
    if(index === 1){
      $('#token_price2').text(result[0].toString());
      $('#max_cap2').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount2').text(result[2].toString()/100);
      $('#status2').text(result[3].toString());
    }
    if(index === 2){
      $('#token_price3').text(result[0].toString());
      $('#max_cap3').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount3').text(result[2].toString()/100);
      $('#status3').text(result[3].toString());
    }
    if (index === 3){
      $('#token_price4').text(result[0].toString());
      $('#max_cap4').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount4').text(result[2].toString()/100);
      $('#status4').text(result[3].toString());
    }
    if (index === 4){
      $('#token_price5').text(result[0].toString());
      $('#max_cap5').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount5').text(result[2].toString()/100);
      $('#status5').text(result[3].toString());
    }
    if (index === 5){
      $('#token_price6').text(result[0].toString());
      $('#max_cap6').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount6').text(result[2].toString()/100);
      $('#status6').text(result[3].toString());
    }
    if (index === 6){
      $('#token_price7').text(result[0].toString());
      $('#max_cap7').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount7').text(result[2].toString()/100);
      $('#status7').text(result[3].toString());
    }
    if (index === 7){
      $('#token_price8').text(result[0].toString());
      $('#max_cap8').text(result[1].toString()/(Math.pow(10,6)));
      $('#discount8').text(result[2].toString()/100);
      $('#status8').text(result[3].toString());
    }
    // setIcoStage(index,result)
    }
    else
      console.log(err)
  })
}

function getCollectedEth() {
	CrowdsaleInstance.ethCollected(function (err, result) {
        if(!err){
            // console.log(result)
            $('#ethCollected').text(result.toString()/Math.pow(10,18));
            return result;
        }
        else
            console.log(err)
    })
}

function getSoldTokens() {
	CrowdsaleInstance.tokensSold(function (err, result) {
        if(!err){
            // console.log(result)
            $('#tokensSold').text(result.toString()/(Math.pow(10,6)));
            // return result;
        }
        else
            console.log(err)
    })
}

function getCurrentStage() {
	CrowdsaleInstance.getCurrentStage(function (err, result) {
        if(!err){
            // console.log(result)
            // current_stage = result.toString();
            current_stage_check.resolve(result.toString());
        }
        else
            console.log(err)
    })
}

function changePreIcoStageTokenPrice(phase, price) {
	CrowdsaleInstance.changePreIcoStageTokenPrice(phase, price*1, function (err, result) {
        if(!err){
            console.log(result)
            // return result;
        }
        else
            console.log(err)
    })
}

function changeIcoStageTokenPrice(phase, price) {
	CrowdsaleInstance.changeIcoStageTokenPrice(phase, price, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function changeIcoPhaseStatus(phase){
  var status;

  if (phase === 0){
    status = document.getElementById('status1').innerHTML;
  }
  if (phase === 1){
    status = document.getElementById('status2').innerHTML;
  }
  if (phase === 2){
    status = document.getElementById('status3').innerHTML;
  }
  if (phase === 3){
    status = document.getElementById('status4').innerHTML;
  }
  if (phase === 4){
    status = document.getElementById('status5').innerHTML;
  }
  if (phase === 5){
    status = document.getElementById('status6').innerHTML;
  }
  if (phase === 6){
    status = document.getElementById('status7').innerHTML;
  }
  if (phase === 7){
    status = document.getElementById('status8').innerHTML;
  }

  if (status === 'true'){
    stopIcoPhase(phase);
  }
  if (status === 'false'){
    startIcoPhase(phase);
  }
}


function startIcoPhase(phase) {
	CrowdsaleInstance.startIcoPhase(phase, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function stopIcoPhase(phase) {
	CrowdsaleInstance.stopIcoPhase(phase, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function sendTokensManually() {

  var address = document.getElementById('ethAddress').value;
  var amount = document.getElementById('numberTokens').value;

  CrowdsaleInstance.sendCrowdsaleTokensManually(address, amount, function (err, result) {
        if(!err){
            console.log(result)
            // return result;
        }
        else
            console.log(err)
    })
}

function getCurrentLockedTransfer(){
  TokenInstance.locked(function (err, result) {
    if(!err){
      $('#currentLockStatus').text(result.toString());
    }
    else
      console.log(err)
  })
}

function changeLock(){
  var value = document.getElementById('currentLockStatus').innerHTML;
  // console.log(value);
  if(value === 'true'){
    TokenInstance.changeLockTransfer(false, function (err, result) {
    if(!err){
      console.log(result)  
    }
    else
      console.log(err)
  })
  }else if (value === 'false'){
    TokenInstance.changeLockTransfer(_bool, function (err, result) {
      if(!err){
        console.log(result)  
      }
        else
        console.log(err)
    })
  }
}

function burnUnsoldTokens(){
  TokenInstance.burnUnsoldTokens(function (err, result){
    if(!err){
        console.log(result)  
      }
        else
        console.log(err)
  })
}

function getTeamTokens(){
  TokenInstance.teamBalance(function (err, result){
    if(!err){
        $('#team_tokens').text(result.toString()/Math.pow(10,6));
        console.log(result)  
      }
        else
        console.log(err)
  })
}

function sendTeamTokens(){

  var address = [];
  address.push(document.getElementById('ethAddressTeam').value);
  console.log(address.length);
  var amount = [];
  amount.push(document.getElementById('numberTokensTeam').value*Math.pow(10,6));
  console.log(amount.length);

  TokenInstance.sendTeamBalance(address, amount, function (err, result){
    if(!err){
        console.log(result)  
      }
        else
        console.log(err)
  })
}

function getBountyTokens(){
  TokenInstance.bountyBalance(function (err, result){
    if(!err){
        $('#bounty_tokens').text(result.toString()/Math.pow(10,6));
        // console.log(result)  
      }
        else
        console.log(err)
  })
}

function sendBountyTokens(){

  var address = [];
  address.push(document.getElementById('ethAddressBounty').value);
  console.log(address.length);
  var amount = [];
  amount.push(document.getElementById('numberTokensBounty').value*Math.pow(10,6));

  TokenInstance.sendBountyBalance(address, amount, function (err, result){
    if(!err){
        console.log(result)  
      }
        else
        console.log(err)
  })
}

function getFoundersTokens(){
  TokenInstance.foundersBalance(function (err, result){
    if(!err){
        $('#found_tokens').text(result.toString()/Math.pow(10,6));
        // console.log(result)  
      }
        else
        console.log(err)
  })
}

function sendFoundersTokens(){

  var address = [];
  address.push(document.getElementById('ethAddressFound').value);
  console.log(address.length);
  var amount = [];
  amount.push(document.getElementById('numberTokensFound').value*Math.pow(10,6));

  TokenInstance.sendFoundersBalance(address, amount, function (err, result){
    if(!err){
        console.log(result)  
      }
        else
        console.log(err)
  })
}

function getPlatformTokens(){
  TokenInstance.platformReferral(function (err, result){
    if(!err){
        $('#plat_tokens').text(result.toString()/Math.pow(10,6));
        // console.log(result)  
      }
        else
        console.log(err)
  })
}

function sendPlatformTokens(){

  var address = [];
  address.push(document.getElementById('ethAddressPlat').value);
  console.log(address.length);
  var amount = [];
  amount.push(document.getElementById('numberTokensPlat').value*Math.pow(10,6));

  TokenInstance.platformReferralBalance(address, amount, function (err, result){
    if(!err){
        console.log(result)  
      }
        else
        console.log(err)
  })
}

function getAdvisorsTokens(){
  TokenInstance.advisorsBalance(function (err, result){
    if(!err){
        $('#adv_tokens').text(result.toString()/Math.pow(10,6));
        // console.log(result)  
      }
        else
        console.log(err)
  })
}

function sendAdvisorsTokens(){

  var address = [];
  address.push(document.getElementById('ethAddressAdv').value);
  console.log(address.length);
  var amount = [];
  amount.push(document.getElementById('numberTokensAdv').value*Math.pow(10,6));

  TokenInstance.platformReferralBalance(address, amount, function (err, result){
    if(!err){
        console.log(result)  
      }
        else
        console.log(err)
  })
}
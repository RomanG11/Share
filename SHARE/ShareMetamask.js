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
    
function startApp() {
    //checking Main net 
    web3.version.getNetwork(function(err, netId){
        console.log(netId);
        if(netId !== "1"){
            //net ID must be 1; Show any message
        }
    });

    // var ethAddr = web3js.eth.defaultAccount;

    if( web3js.eth.defaultAccount; === undefined ){
        // $('#metamaskCheck').css('display', 'block');
        // Metamask is not active. Show any message
    }

    // TokenContract = web3js.eth.contract(tokenAbi);
    // TokenInsance = TokenContract.at("0xbe8d9b69238a107440cfd61c48de4b5c4a65aa5b") //PUT YOUR ADDRESS

    CrowdsaleContract = web3js.eth.contract(crowdsaleAbi);
    CrowdsaleInstance = CrowdsaleContract.at("0xbe8d9b69238a107440cfd61c48de4b5c4a65aa5b");//PUT YOUR ADDRESS

    var is_ico = isIco();
    var is_pre_ico = isPreIco();

    getCollectedEth();

    



}

// var tokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endICO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_request","type":"bool"}],"name":"changeLockTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setCrowdsaleContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_value","type":"uint256"}],"name":"sendCrowdsaleTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"locked","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
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

function getStageToFront() {
  var stage = getCurrentStage();
  var 
}



function getPreIcoStage(index) {
	CrowdsaleInstance.preIcoStages(index, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function getIcoStage(index) {
	CrowdsaleInstance.icoStages(index, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function getCollectedEth() {
	CrowdsaleInstance.ethCollected(function (err, result) {
        if(!err){
            // console.log(result)
            $('#ethCollected').text(result.toString());
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
            $('#tokensSold').text(result.toString());
            return result;
        }
        else
            console.log(err)
    })
}

function isPreIco() {
	CrowdsaleInstance.isPreIco(function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function isIco() {
	CrowdsaleInstance.isIco(function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function getCurrentStage() {
	CrowdsaleInstance.getCurrentStage(function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function changePreIcoStageTokenPrice(price) {
	CrowdsaleInstance.changePreIcoStageTokenPrice(price, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function changeIcoStageTokenPrice(price) {
	CrowdsaleInstance.changeIcoStageTokenPrice(price, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}

function startPreIcoPhase(phase) {
	CrowdsaleInstance.startPreIcoPhase(phase, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
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

function stopPreIcoPhase(phase) {
	CrowdsaleInstance.stopPreIcoPhase(phase, function (err, result) {
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

  CrowdsaleInstance.sendTokensManually(address, amount, function (err, result) {
        if(!err){
            console.log(result)
            return result;
        }
        else
            console.log(err)
    })
}
var authTokenWithEquals = (location.href.split('#')[1]).split('&')[1];
const COGNITO_AUTH_TOKEN = authTokenWithEquals.split('=')[1];
var idTokenWithEquals = (location.href.split('#')[1]).split('&')[0];
var COGNITO_ID_TOKEN = idTokenWithEquals.split('=')[1];
COGNITO_ID_TOKEN = parseJwt(COGNITO_ID_TOKEN);
var dict = [];

// var list = [
//   { type: 'delete', coin: 'btc', amount: 0 },
//   { type: 'add', coin: 'eth', amount: 20053.0 },
//   { type: 'add', coin: 'ltc', amount: 45652 }
// ];

window.onload = () => {
        loadTableData();
        //getCoinPrices();
    };

function loadTableData(){
    const tableBody = document.getElementById('tableData')
    let dataHtml = '';

    //getMockCoins();
    getCoins();
    for (i = 0; i < localStorage.length; i++) {
        let splitArray = String(localStorage.getItem(localStorage.key(i))).split('.');
        dataHtml += `<tr id="row${i}"><td><button id="hiddenButton${localStorage.key(i)}" style="display:none" onclick="remove(${i})">-</button></td>
          <td id="${localStorage.key(i)}">${localStorage.key(i)}</td><td id="${localStorage.key(i)}Amount">${splitArray[0]}.</td>
          <td id="${localStorage.key(i)}Amount2">${splitArray[1]}</td></tr>`
    }
    dataHtml += `<tr><td></td>
    <td id="coinOptions">
    <select id="listOfCoins" style="display:none">
        <option value="empty" selected="selected"></option>
        <option value="btc">btc</option>
        <option value="eth">eth</option>
        <option value="ltc">ltc</option>
    </select></td>
    
    <td id="editAmount" colspan="2"><input placeholder="Amount" id="editAmountTextField" style="display:none"/></td></tr>`
    tableBody.innerHTML = dataHtml;
    //localStorage.clear();
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getMockCoins() {
  localStorage.setItem('btc','1.00000000');
  localStorage.setItem('eth','145.00000000');
}

function getCoins(){
  //Grabs username and passowrd from document to be used as parameters for API
  let email = COGNITO_ID_TOKEN.email;
  let BITCOOOONECT_API = "https://t3d210uhn7.execute-api.us-east-2.amazonaws.com/test/portfolio?emailId="+email;

  axios.get(BITCOOOONECT_API, {
      headers: {
          'Authorization': COGNITO_AUTH_TOKEN
      }
  }).then((res) => {
    try {
        objKeys = Object.keys(res.data.user.coins);
        objValues = Object.values(res.data.user.coins);
        for(let i = 0; i < Object.keys(res.data.user.coins).length; i++) {
          //converts number to be number with 8 decimal places
          let value = (objValues[i]).toFixed(8); 
          localStorage.setItem(String(objKeys[i]),String(value));
        }
    } catch (error) { 
      alert("API offline: GET");
    }
    
  })
}

function getCoinPrices(){
  //Grabs username and passowrd from document to be used as parameters for API
  let email = COGNITO_ID_TOKEN.email;
  let BITCOOOONECT_API = `https://t3d210uhn7.execute-api.us-east-2.amazonaws.com/test/coins?${["btc","ada","eth"].map((n, index) => `ids[${index}]=${n}`).join('&')}`;

  const body = {
    "ids": [
        "btc",
        "eth",
        "woo"
      ]
  }

  axios.get(BITCOOOONECT_API, {
      
        headers: {
          'Authorization': COGNITO_AUTH_TOKEN
      }
  }).then((res) => {
    try {
        objKeys = Object.keys(res.data.user.coins);
        objValues = Object.values(res.data.user.coins);
        console.log(res)
        console.log(res.data)
        for(let i = 0; i < Object.keys(res.data.user.coins).length; i++) {
          console.log(objKeys[i]);
          console.log(objValues[i]);
          //converts number to be number with 8 decimal places
          let value = (objValues[i]).toFixed(8); 
          localStorage.setItem(String(objKeys[i]),String(value));
        }
        for (i = 0; i < localStorage.length; i++)   {
          console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
        }
    } catch (error) { 
      alert("API offline:COIN API");
    }
    
  })
}
//needs tweaking-J
function createAccount() {

  let username = document.getElementById("username").value;
  let usernameAttachment = "authToken="+document.getElementById("username").value;
  let BITCOOOONECT_API = "https://t3d210uhn7.execute-api.us-east-2.amazonaws.com/test/portfolio"

  const userObj = {
  };

  axios.post(BITCOOOONECT_API, userObj).then((res) => {
    console.log(res.data);
    try {
        let authToken = res.data.user.authToken;
        var para=document.createElement("p");
            var node=document.createTextNode(String(authToken));
            para.appendChild(node);
            para.style.color="red";
            var element=document.getElementById("d2");
            element.appendChild(para)
      
    } catch (error) { 
      alert("API is disconnected");
    }
    
  })
  
}

function updateAccount(coin, amount) {
  
  let BITCOOOONECT_API = "https://t3d210uhn7.execute-api.us-east-2.amazonaws.com/test/portfolio"

  console.log("at updateAccount");
  const user = {
    "emailId": COGNITO_ID_TOKEN.email,
    "coinId": coin,
    "amount": parseInt(amount)
  }
  console.log(user);
  axios.post(BITCOOOONECT_API, user, {
      headers: {
          'Authorization': COGNITO_AUTH_TOKEN
      }
  }).then((res) => {
    try {
        console.log(res);
    } catch (error) { 
        alert("API offline: UPDATE");
    }
    
  })
}

function editFunction() {
    //displays removeButtons
    for(let i = 0; i < localStorage.length;i++){
      var string = "hiddenButton" + localStorage.key(i);
      var hidden = document.getElementById(string);
      hidden.style.display = "block";  
      hidden.style.position = "absolute";
    }
    //makes coin dropdown and amount appaer 
    var hiddenAmountTextField = document.getElementById('editAmountTextField');
    hiddenAmountTextField.style.display = "block";  
    hiddenAmountTextField.style.position = "absolute";

    var hiddenListOfCoins = document.getElementById('listOfCoins');
    hiddenListOfCoins.style.display = "block";  
    hiddenListOfCoins.style.position = "absolute";

}

function saveFunction() {
  //grab a new object if its been created
  var newCoinValue = document.getElementById('listOfCoins').value;
  var newAmountValue = document.getElementById('editAmountTextField').value;
  var isNewCoin = true;
  for(let i = 0; i < localStorage.length;i++){
    if(localStorage.key(i) == newCoinValue){
      isNewCoin = false;
      console.log(false);
    }
  }
  if(newCoinValue != "" && isNewCoin && newAmountValue != ""){
    
    console.log(newCoinValue);
    console.log(newAmountValue);
    objectToAdd = {type: 'add', coin: newCoinValue, amount: newAmountValue};
    dict.push(objectToAdd)
  }
  //if not empty dict go through list then empty it
  if(dict.length > 0){
    for (let i = 0; i < dict.length; i++) {
      console.log("before updateAccount");
      updateAccount(dict[i].coin,dict[i].amount);
    }
    alert('User updated');
  }
  dict = {}

  //start to hide elements
  for(let i = 0; i < localStorage.length;i++){
    var string = "hiddenButton" + localStorage.key(i);
    var hidden = document.getElementById(string);
    hidden.style.display = "none";  // <-- Set it to block
  }
  var hiddenAmountTextField = document.getElementById('editAmountTextField');
  hiddenAmountTextField.style.display = "none";  
  var hiddenListOfCoins = document.getElementById('listOfCoins');
  hiddenListOfCoins.style.display = "none";  
  
  //parse through html and fix your naming conventions
  //nuke and restart
  document.getElementById('tableData').innerHTML ="";
  loadTableData();
  //window.location.reload();

}

function remove(index) {
  var rowString = "row"+String(index);
  const rowBody = document.getElementById(rowString);
  console.log(rowBody);
  rowBody.remove();
  //remove in local storage
  objectToRemove = {type: 'delete', coin: localStorage.key(index), amount: 0};
  dict.push(objectToRemove);
}

function clearStorage() {
  localStorage.clear();
}



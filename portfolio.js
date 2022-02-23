var authTokenWithEquals = (location.href.split('#')[1]).split('&')[1];
const COGNITO_AUTH_TOKEN = authTokenWithEquals.split('=')[1];
console.log(COGNITO_AUTH_TOKEN);
var idTokenWithEquals = (location.href.split('#')[1]).split('&')[0];
var COGNITO_ID_TOKEN = idTokenWithEquals.split('=')[1];
var COGNITO_ID_TOKEN = parseJwt(COGNITO_ID_TOKEN);
console.log(COGNITO_ID_TOKEN);

var dict = [];

window.onload = () => {
        loadTableData();
    };

function loadTableData(){
    const tableBody = document.getElementById('tableData')
    let dataHtml = '';
    


    console.log(parseJwt(COGNITO_ID_TOKEN));

    getCoins(COGNITO_AUTH_TOKEN);

    for (i = 0; i < localStorage.length; i++) {
        let splitArray = String(localStorage.getItem(localStorage.key(i))).split('.');
        dataHtml += `<tr><td>${localStorage.key(i)}</td><td>${splitArray[0]}.</td><td>${splitArray[1]}</td><tr>`
    }
    tableBody.innerHTML = dataHtml;
    localStorage.clear();
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};




function getCoins(AWSauthToken){
  //Grabs username and passowrd from document to be used as parameters for API
  let email = COGNITO_ID_TOKEN.email;
  let BITCOOOONECT_API = "https://t3d210uhn7.execute-api.us-east-2.amazonaws.com/test/portfolio?email="+email;

  axios.get(BITCOOOONECT_API, {
      headers: {
          'Authorization': AWSauthToken
      }
  }).then((res) => {
    try {
        objKeys = Object.keys(res.data.user.coins);
        objValues = Object.values(res.data.user.coins);
        console.log(res)
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
      alert("API offline");
    }
    
  })
}

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

function updateAccount(coin, amount, ) {
  
  let BITCOOOONECT_API = "https://t3d210uhn7.execute-api.us-east-2.amazonaws.com/test/portfolio"

  const user = {
    "authToken": '00c93687-35a9-403d-bfa9-562ddc864663',
    "coinId": 'btc',
    "amount": '2'
  }
  axios.post(BITCOOOONECT_API, user, {
      headers: {
          'Authorization': COGNITO_AUTH_TOKEN
      }
  }).then((res) => {
    try {
        alert('User updated');
    } catch (error) { 
        alert("API offline");
    }
    
  })
}

function updates() {

    dict.push({
        key:   "keyName",
        value: "the value"
    });

    dict.push({
        key:   "keyName",
        value: "the value2"
    });
    console.log(dict);
}



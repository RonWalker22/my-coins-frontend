window.onload = () => {
        loadTableData();
    };

function loadTableData(){
    const tableBody = document.getElementById('tableData')
    let dataHtml = '';
    var authTokenWithEquals = (location.href.split('#')[1]).split('&')[1];
    var COGNITO_AUTH_TOKEN = authTokenWithEquals.split('=')[1];

    var idTokenWithEquals = (location.href.split('#')[1]).split('&')[0];
    var COGNITO_ID_TOKEN = idTokenWithEquals.split('=')[1];
    

    getCoins(COGNITO_AUTH_TOKEN);

    for (i = 0; i < localStorage.length; i++) {
        let splitArray = String(localStorage.getItem(localStorage.key(i))).split('.');
        dataHtml += `<tr><td>${localStorage.key(i)}</td><td>${splitArray[0]}.</td><td>${splitArray[1]}</td><tr>`
    }
    tableBody.innerHTML = dataHtml;
    localStorage.clear();
}




function getCoins(AWSauthToken){
  //Grabs username and passowrd from document to be used as parameters for API
  let authToken = "00c93687-35a9-403d-bfa9-562ddc864663";
  console.log(AWSauthToken);
  let BITCOOOONECT_API = "https://t3d210uhn7.execute-api.us-east-2.amazonaws.com/test/portfolio?authToken="+authToken;

  axios.get(BITCOOOONECT_API, {
      headers: {
          'Authorization': AWSauthToken
      }
  }).then((res) => {
    try {
        console.log(res.data.user)
        objKeys = Object.keys(res.data.user.coins);
        objValues = Object.values(res.data.user.coins);
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
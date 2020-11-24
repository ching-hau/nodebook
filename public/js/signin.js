window.fbAsyncInit = () => {
    FB.init({
        appId : '412468749922091',
        cookie: true,
        xfbml: true, 
        version: "v9.0"
    });
}

function getCorrectConf(data){
    let config = {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    return config;       
}

function setToken(result){
    if(result.stat = "success"){
        let {pcToken} = result;
        window.localStorage.setItem('pcToken', pcToken)
        console.log(result)
    }
}

function statusChangeCallback(res){
    console.log("statusChange Callback");
    if(res.status ==="connected"){
        let data = {
            access_token: res.authResponse.accessToken,
            group: "facebook"
        }
        fetch('/sign/signin', getCorrectConf(data))
        .then(res=>res.json())
        .then(result=>{setToken(result)})
    }else{
        document.querySelector("#status").innerHTML = "Please log into this webpage!"
    }
}



//Called when a person is finished with Login Button
function checkLoginState(){
    FB.getLoginStatus((res) => {
        statusChangeCallback(res);
    })
}

function googleSignIn(googleUser) {
    let gToken = googleUser.getAuthResponse().id_token;
    //window.localStorage.setItem('access_token', gToken)
    //window.localStorage.setItem('group', 'google')
    let data = {
        access_token: gToken,
        group: "google"
    }
    console.log(gToken)
    console.log(getCorrectConf(data))
    fetch('/sign/signin', getCorrectConf(data))
    .then(res=>res.json())
    .then(result=>{setToken(result)})
    //let profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }


function signInBtn(){
    const signInMail = document.querySelector("#emailin").value;
    const signInPwd = document.querySelector("#passwordin").value;
    let data = {
        email: signInMail,
        password: signInPwd,
        group: "native"
    }
    fetch('/sign/signin', getCorrectConf(data))
    .then(res=>res.json())
    .then(result=>{setToken(result)})
    
}

function signUpBtn(){
    const signUpName = document.querySelector("#nameup").value;
    const signUpMail = document.querySelector("#emailup").value;
    const signUpPwd = document.querySelector("#passwordup").value;
    let data = {
        name: signUpName,
        email: signUpMail,
        password: signUpPwd
    }
    fetch('/sign/signup', getCorrectConf(data))
    .then(res=>res.json())
    .then(result=>{console.log(result)})
}




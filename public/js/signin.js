window.fbAsyncInit = () => {
    FB.init({
        appId : '412468749922091',
        cookie: false,
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
        window.localStorage.setItem('pcToken', pcToken);
        window.location.replace("/userFile.html")
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

//Render Google buttomn
function renderButton() {
    gapi.signin2.render("googleButton", {
        'scope': 'profile email',
        'width': 229,
        'height': 40,
        'longtitle': true,
        'onsuccess': googleSignIn,
        'onfailure': onFailure
    })
}

function onFailure(error){
    console.log(error)
}

function googleSignIn(googleUser) {
    let gToken = googleUser.getAuthResponse().id_token;

    let data = {
        access_token: gToken,
        group: "google"
    }
    gapi.auth2.getAuthInstance().disconnect()
    fetch('/sign/signin', getCorrectConf(data))
    .then(res=>res.json())
    .then(result=>{
        setToken(result);
        googleLoginStatus = true;
    })
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
    .then(result => {
        if(result.stat == "Welcome to programing chatting!"){
            console.log(result)
            //alert("You can log in now!!!");
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Welcome to programing chatting!`,
                text: "You can log in now.",
                showConfirmButton: false,
                timer: 1500
            })
        }
    })  
}


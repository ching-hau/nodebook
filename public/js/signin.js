window.fbAsyncInit = () => {
  FB.init({
    appId: '412468749922091',
    cookie: true,
    xfbml: true,
    version: 'v9.0',
    status: true
  })
}

/*
 * fB.getLoginStatus(function (response){
 * console.log(response)
 * })
 */

function getCorrectConf (data) {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }

  return config
}

function setToken (result) {
  if (result.stat = 'success') {
    const { pcToken } = result
    window.localStorage.setItem('pcToken', pcToken)
    window.location.replace('/userFile.html')
    console.log(result)
  }
}

function statusChangeCallback (res) {
  console.log('statusChange Callback')
  if (res.status === 'connected') {
    const data = {
      access_token: res.authResponse.accessToken,
      group: 'facebook'
    }
    fetch('/sign/signin', getCorrectConf(data))
      .then((res) => res.json())
      .then((result) => {
        setToken(result)
      })
  } else {
    document.querySelector('#status').innerHTML = 'Please log into this webpage!'
  }
}

// called when a person is finished with Login Button
function checkLoginState () {
  FB.getLoginStatus((res) => {
    statusChangeCallback(res)
  })
}

// render Google buttomn
function renderButton () {
  gapi.signin2.render('googleButton', {
    scope: 'profile email',
    width: 229,
    height: 40,
    longtitle: true,
    onsuccess: googleSignIn,
    onfailure: onFailure
  })
}

function onFailure (error) {
  console.log(error)
}

function googleSignIn (googleUser) {
  const gToken = googleUser.getAuthResponse().id_token

  const data = {
    access_token: gToken,
    group: 'google'
  }
  gapi.auth2.getAuthInstance().disconnect()
  fetch('/sign/signin', getCorrectConf(data))
    .then((res) => res.json())
    .then((result) => {
      setToken(result)
      googleLoginStatus = true
    })
}

function signInBtn () {
  const signInMail = document.querySelector('#emailin').value
  const signInPwd = document.querySelector('#passwordin').value
  const data = {
    email: signInMail,
    password: signInPwd,
    group: 'native'
  }
  fetch('/sign/signin', getCorrectConf(data))
    .then((res) => res.json())
    .then((result) => {
      setToken(result)
    })
}

function signUpBtn () {
  const signUpName = document.querySelector('#nameup').value
  const signUpMail = document.querySelector('#emailup').value
  const signUpPwd = document.querySelector('#passwordup').value
  const data = {
    name: signUpName,
    email: signUpMail,
    password: signUpPwd
  }
  fetch('/sign/signup', getCorrectConf(data))
    .then((res) => res.json())
    .then((result) => {
      if (result.stat == 'Welcome to programing chatting!') {
        console.log(result)
        // alert("You can log in now!!!");
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Welcome to programing chatting!',
          text: 'You can log in now.',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
}

/*
 * var longestCommonPrefix = function(strs) {
 * let current;
 * let final ="";
 * if(strs.length === 1){
 * return strs[0];
 * }else if(strs[0]){
 * for(let i = 0; i < strs[0].length; i ++){
 * for(let j = i +2; j < strs[0].length; j ++){
 * let currentIndex = strs[0].slice(i, j);
 * for(let k = 1; k < strs.length; k++){
 * if(strs[k].indexOf(currentIndex) ==-1){
 * current = -1;
 * break;
 * }else{
 * current = currentIndex;
 * }
 * }
 * if(current !==1 && current.length > final.length){
 * final = current;
 * }
 * }
 * }
 * return final;
 * }else{
 * return final;
 * }
 */

// };

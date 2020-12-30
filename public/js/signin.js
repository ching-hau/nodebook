window.fbAsyncInit = () => {
  FB.init({
    appId: '412468749922091',
    cookie: true,
    xfbml: true,
    version: 'v9.0',
    status: true
  })
}

function getCorrectConf (data) {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }
  return config
}

function setToken (result) {
  if (result.stat === 'success') {
    const { pcToken } = result
    window.localStorage.setItem('pcToken', pcToken)
    window.location.replace('/userFile.html')
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
      if (result.stat === 'Welcome to programing chatting!') {
        console.log(result)
        // alert("You can log in now!!!");
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Welcome to NODEBOOK!',
          text: 'You can log in now.',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
}

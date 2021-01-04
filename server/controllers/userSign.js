const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const crypto = require('crypto')
const signDB = require('../db/signDB')
require('dotenv').config()

const JWTKEY = process.env.JWT_KEY

const verifyToken = (req, res, next) => {
  const { pctoken } = req.headers
  jwt.verify(pctoken, JWTKEY, (err, authData) => {
    if (err) {
      res.status(200).send({ stat: 'fail token' })
    } else {
      // userMail = authData.userInfo.user.email
      req.userMail = authData.userInfo.user.email
      next()
    }
  })
}

const getCorrectUrl = (group, access_token) => {
  if (group === 'facebook') {
    return `https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`
  } if (group === 'google') {
    return `https://oauth2.googleapis.com/tokeninfo?id_token=${access_token}`
  }
}

const getUserInfoPayLoad = async (checkingDBResult, userInfo, group) => {
  if (checkingDBResult.length > 0) {
    return checkingDBResult[0]
  }
  await signDB.createUser([
    userInfo.name,
    userInfo.email,
    'na',
    group
  ])
  const updateDBResult = await signDB.checkUserExistence(userInfo.email)

  return updateDBResult[0]
}

const checkThirdPartIn = async (req) => {
  const { group, access_token } = req.body
  const accessDataUrl = getCorrectUrl(group, access_token)
  const userInfo = await fetch(accessDataUrl).then((result) => result.json())
  const checkingDBResult = await signDB.checkUserExistence(userInfo.email)
  const replyingResult = await getUserInfoPayLoad(checkingDBResult, userInfo, group)

  return {
    stat: 'Welcome to programing chatting!',
    user: replyingResult
  }
}

const checkNativeSignIn = async (req) => {
  const { email, password } = req.body
  const userInfo = await signDB.checkUserExistence(email)
  const hash = crypto.createHash('sha256')
  hash.update(password)
  const encpPwd = hash.digest('hex')
  if (userInfo.length === 0) {
    return {
      stat: 'Please sign up first!',
      user: 'na'
    }
  } if (userInfo[0].login === 'facebook') {
    return {
      stat: 'This mail is registered through facebook!',
      user: 'na'
    }
  } if (userInfo[0].password === encpPwd) {
    return {
      stat: 'Welcome to programing chatting!',
      user: userInfo[0]
    }
  }
  return {
    stat: 'Wrong Password!',
    user: 'na'
  }
}

const getUserInfo = async (req) => {
  const { group } = req.body
  let userInfo
  if (group === 'facebook' || group === 'google') {
    userInfo = await checkThirdPartIn(req)
  } else if (group === 'native') {
    userInfo = await checkNativeSignIn(req)
  } else {
    userInfo = {
      stat: 'na',
      user: 'na'
    }
  }
  return userInfo
}
module.exports = {
  verifyToken,
  getUserInfo
}

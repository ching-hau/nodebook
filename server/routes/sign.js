const express = require('express')
const router = express.Router()
const signDB = require('../db/signDB')
const jwt = require('jsonwebtoken')
const userSign = require('../controllers/userSign')
const crypto = require('crypto')
require('dotenv').config()

const JWTKEY = process.env.JWT_KEY

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  const hash = crypto.createHash('sha256')
  hash.update(password)
  const encpPwd = hash.digest('hex')
  const userExisted = await signDB.checkUserExistence(email)
  if (userExisted.length > 0) {
    res.status(200).send({ stat: 'This mail has been registered!' })
  } else {
    await signDB.createUser([
      name,
      email,
      encpPwd,
      'native'
    ])
    res.status(200).send({ stat: 'Welcome to programing chatting!' })
  }
})

router.post('/signin', async (req, res) => {
  const userInfo = await userSign.getUserInfo(req)
  if (userInfo.user === 'na') {
    return res.status(200).json(userInfo)
  } else {
    const pcToken = jwt.sign({ userInfo }, JWTKEY, { expiresIn: 36000 })
    const { id, name, email } = userInfo.user
    console.log('here!!!')
    console.log(userInfo)
    return res.status(200).json({
      stat: 'success',
      user: {
        id: id,
        name: name,
        email: email
      },
      pcToken: pcToken
    })
  }
})

module.exports = router

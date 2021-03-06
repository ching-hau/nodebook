const express = require('express')
const router = express.Router()
const fileDB = require('../db/fileDB')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWTKEY = process.env.JWT_KEY

router.post('/saveas', verifyToken, async (req, res) => {
  const data = {
    user_email: req.userMail,
    file_name: req.body.file_name,
    file_content: req.body.file_content
  }
  const resultConf = {
    project_id: 'na',
    user_mail: req.userMail,
    file_name: data.file_name,
    file_content: data.file_content
  }
  console.log(resultConf)
  try {
    const insertResult = await fileDB.saveNewFileContent(data)
    console.log(insertResult)
    if (insertResult.stat === 'success') {
      resultConf.project_id = insertResult.project_id
      resultConf.stat = 'success'
      res.status(200).send(resultConf)
    }
  } catch (err) {
    console.log(err)
    resultConf.stat = err.stat
    res.status(200).send(resultConf)
  }
})

router.post('/save', verifyToken, async (req, res) => {
  const data = req.body
  const resultConf = {
    project_id: 'na',
    user_mail: req.userMail,
    file_name: data.file_name,
    file_content: data.file_content
  }
  try {
    const updateResult = await fileDB.updateFileContent(data)
    if (updateResult.stat === 'success') {
      console.log('saved the file successfully')
      resultConf.project_id = data.project_id
      res.status(200).send(resultConf)
    } else {
      res.status(200).send(resultConf)
    }
  } catch (err) {
    console.log(err)
  }
})

router.post('/files', verifyToken, async (req, res) => {
  const { id } = req.query
  const result = await fileDB.getFileById(id)
  if (req.userMail === result[0].user_email) {
    const resultConf = {
      stat: 'success',
      project_id: id,
      user_mail: result[0].user_email,
      file_name: result[0].file_name,
      file_content: result[0].file_content,
      file_delete: result[0].file_delete
    }
    res.status(200).send(resultConf)
  } else {
    res.status(200).send({ stat: 'invalid' })
  }
})

router.get('/allProjectsId', verifyToken, async (req, res) => {
  const { userMail } = req
  const allId = await fileDB.getAllProjectIdByUser(userMail)
  res.status(200).send(allId)
})

router.post('/user', verifyToken, async (req, res) => {
  const { userMail } = req
  const allId = await fileDB.getAllProjectIdByUser(userMail)
  res.status(200).send(allId)
})

router.post('/delete', verifyToken, async (req, res) => {
  const { projectID } = req.body
  try {
    const deleteResult = await fileDB.updateFileById('delete', projectID)
    res.status(200).send(deleteResult)
  } catch (err) {
    res.status(200).send(err)
  }
})

router.post('/recover', verifyToken, async (req, res) => {
  const { projectID } = req.body
  try {
    const recover = await fileDB.updateFileById('recover', projectID)
    res.status(200).send(recover)
  } catch (err) {
    res.status(200).send(err)
  }
})

router.post('/deleteForever', verifyToken, async (req, res) => {
  const { projectID } = req.body
  try {
    const deleteForeverResult = await fileDB.deleteFileById(projectID)
    res.status(200).send(deleteForeverResult)
  } catch (err) {
    res.status(200).send(err)
  }
})

router.post('/deleteAll', verifyToken, async (req, res) => {
  const { userMail } = req
  const deleteResult = await fileDB.clearDeletedFileByUserMail(userMail)
  res.status(200).send(deleteResult)
})

router.get('/public', async (req, res) => {
  const { publicFile } = req.query
  try {
    const projectId = await fileDB.getPublicData(publicFile)
    console.log(projectId.file_id)
    const rawData = await fileDB.getFileById(projectId.file_id)
    res.status(200).send({
      stat: 'success',
      file_content: rawData[0].file_content
    })
  } catch (err) {
    res.status(200).send({ stat: 'fail' })
  }
})

router.get('/filePublicCheck', async (req, res) => {
  const { id } = req.query
  try {
    const result = await fileDB.checkPublicFile(id)
    if (result[0]) {
      res.status(200).send(result[0])
    } else {
      res.status(200).send({ stat: 'fail' })
    }
  } catch (err) {
    console.log(err)
  }
})

router.post('/toPublic', async (req, res) => {
  const { id } = req.body
  try {
    await fileDB.shareToPublic(id)
    res.status(200).send({ stat: 'success' })
  } catch (err) {
    res.status(200).send({ stat: 'fail' })
  }
})

router.post('/cancelPublic', async (req, res) => {
  const { id } = req.body
  try {
    await fileDB.cancelPublicShare(id)
    res.status(200).send({ stat: 'success' })
  } catch (err) {
    res.status(200).send({ stat: 'fail' })
  }
})

function verifyToken (req, res, next) {
  const { pctoken } = req.headers
  jwt.verify(pctoken, JWTKEY, (err, authData) => {
    if (err) {
      res.status(200).send({ stat: 'fail token' })
    } else {
      const verifiedMail = authData.userInfo.user.email
      console.log(authData)
      req.userMail = verifiedMail
      next()
    }
  })
}

module.exports = router

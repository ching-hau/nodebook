const express = require('express')
const router = express.Router()
const cp = require('../controllers/childProcessCon')

router.post('/test', async (req, res) => {
  const { content, file } = req.body
  const path = `OtherCode/${file}.js`
  await cp.writeFile(content, path)
  const result = await cp.runChildProcess(path)
  res.status(200).send({ result })
})

module.exports = router

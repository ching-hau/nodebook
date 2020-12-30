const express = require('express')
const app = express()
require('dotenv').config()

const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')

const socketChild = require('./server/controllers/socketChild')
io.on('connection', socketChild)

const port = process.env.PORT

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const signRouter = require('./server/routes/sign')
const fileRouter = require('./server/routes/file')

app.use('/sign', signRouter)
app.use('/file', fileRouter)

server.listen(port, () => {
  console.log(`NODEBOOK is running on port ${port}!`)
})

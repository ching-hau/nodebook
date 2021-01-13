const jwt = require('jsonwebtoken')
const cp = require('./childProcessCon')

const JWTKEY = process.env.JWT_KEY
const { ROOMKEY } = process.env

const writeContentToFile = async (file, content) => {
  const filePath = `${process.env.PROCESS_PATH}${file}.js`
  await cp.writeFile(content, filePath)
  return filePath
}

const summarizeResult = async (file1Path, file2Path) => {
  const file1Result = cp.runChildProcess(file1Path)
  const file2Result = cp.runChildProcess(file2Path)
  const allResult = await Promise.all([
    file1Result,
    file2Result
  ])
  if (allResult[1]) {
    return allResult[1].replace(allResult[0], '').toString()
  }
  return allResult[0].toString()
}

const checkCpkeyWord = (content) => {
  if((content.indexOf('import') !== -1) | (content.indexOf('require') !== -1)) {
    return true
  } else {
    return false
  }
}

const socketAction = (socket) => {
  let roomByProjectId,
    roomByUser
  socket.on('start to connect', (msg) => {
    roomByProjectId = msg.projectID
    socket.join(roomByProjectId)
    socket.emit('join room', `join room ${msg}`)
    socket.to(roomByProjectId).emit('update or not', 'any update?')

    jwt.verify(msg.token, JWTKEY, (err, authData) => {
      if (err) {
        socket.emit('please get the new token')
      }
      roomByUser = authData.email + ROOMKEY
      socket.join(roomByUser)
    })
  })

  socket.on('the latest status', (result) => {
    socket.to(roomByProjectId).emit('update the content', result)
  })

  socket.on('new project connected', (msg) => {
    jwt.verify(msg.token, JWTKEY, (err, authData) => {
      if (err) {
        socket.emit('please get the new token')
      } else {
        roomByUser = authData.email + ROOMKEY
        socket.join(roomByUser)
      }
    })
  })

  socket.on('click to change mode', (msg) => {
    if (msg === 'normal') {
      socket.to(roomByUser).emit('change mode syn', { target: { className: 'off' } })
    } else {
      socket.to(roomByUser).emit('change mode syn', { target: { className: 'on' } })
    }
  })

  socket.on('update file', () => {
    socket.to(roomByUser).emit('update user list')
  })

  socket.on('send code', async (data) => {
    const {
      content1, content2, file1, file2, index
    } = data
    if((checkCpkeyWord(content1) === true) | (checkCpkeyWord(content2) === true)) {
      console.log('have the keyword')
      socket.emit('send result', {
        result: 'Please try do not use the keyword, such as import, require...',
        index
      })
      return
    }
    const file1Path = await writeContentToFile(file1, content1)
    const file2Path = await writeContentToFile(file2, content2)
    try {
      const summarizedResult = await summarizeResult(file1Path, file2Path)
      console.log(summarizedResult)
      socket.emit('send result', {
        result: summarizedResult,
        index
      })
    } catch (err) {
      socket.emit('send result', {
        result: err,
        index
      })
    }
  })
}
module.exports = socketAction

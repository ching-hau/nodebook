const childProcess = require('child_process')
const fs = require('fs')
const he = require('he')
require('dotenv').config()

function extractError (err) {
  const lines = err.split('\n')
  if (lines[1] === '<--- Last few GCs --->') {
    return 'Your code result is out of memory -10mb.'
  } else if (lines[4] === 'RangeError: Maximum call stack size exceeded') {
    return lines[4]
  }

  return `${lines[1]}\n${lines[4]}`
}

const runChildProcess = (path) => new Promise((resolve, reject) => {
  const command = `node --max-old-space-size=10 ${path}`
  const workerProcess = childProcess.exec(command)
  let output = ''
  setTimeout(() => {
    console.log('start to kill')
    workerProcess.kill()
    workerProcess.exitCode = 1
    console.log(`${path} exit reject code: ${workerProcess.exitCode}`)
    reject('This code cost too much time to complete.')
  }, 2000)
  workerProcess.on('exit', () => {
    console.log('exit the code successfully')
    console.log(`${path} exit resolve code: ${workerProcess.exitCode} in exit`)
    deleteFile(path)
  })
  workerProcess.stdout.on('data', (data) => {
    output += data
  })
  workerProcess.stderr.on('data', (data) => {
    resolve(extractError(data))
  })
  workerProcess.stdout.on('end', () => {
    console.log(`${path} exit resolve code: ${workerProcess.exitCode} in end`)
    resolve(output)
  })
})

const writeFile = (content, path) => new Promise((resolve, reject) => {
  const newContent = he.decode(content.replace(/<br>/g, ''))
  fs.writeFile(path, newContent, (err) => {
    if (err) {
      reject(err)
    }
    const message = `${path} was created successfully.`
    console.log(message)
    resolve()
  })
})

const deleteFile = (path) => new Promise((resolve, reject) => {
  fs.unlink(path, (err) => {
    if (err) {
      reject(err)
    }
    const message = `${path} was deleted successfully.`
    console.log(message)
    resolve()
  })
})

module.exports = {
  extractError,
  runChildProcess,
  writeFile,
  deleteFile
}

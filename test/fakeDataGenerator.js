require('dotenv').config()
const dbConfig = require('../server/db/dbConfig')
const con = dbConfig.sqlCon
const {
  users,
  user_file
} = require('./fakeData')

const createFakeUsers = (users) => new Promise((resolve, reject) => {
  let sqlInsertUser = 'INSERT INTO user (name, email, password, login) VALUES ?'
  con.query(sqlInsertUser, [users.map(element => Object.values(element))], (err) => {
    if(err) {reject(err)}
    resolve()
  })
})

const createFakeUserFiles = (user_file) => new Promise((resolve, reject) => {
  let sqlInsertUserFile = 'INSERT INTO user_file (user_email, file_name, file_content, file_delete) VALUES ?'
  con.query(sqlInsertUserFile, [user_file.map(element => Object.values(element))], (err) => {
    if(err) {reject(err)}
    resolve()
  })
})

const truncateTable = (tableName) => new Promise((resolve, reject) => {
  let sqlTruncateTable = 'TRUNCATE TABLE ' + tableName
  con.query(sqlTruncateTable, (err) => {
    if(err) {reject(err)}
    resolve()
  })
})

const clearTestDB = async () => {
  await truncateTable('user')
  await truncateTable('user_file')
  return
}

const createFakeData = async () => {
  await createFakeUsers(users)
  await createFakeUserFiles(user_file)
  return
}
module.exports = {
  clearTestDB,
  createFakeData
}

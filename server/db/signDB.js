const dbConfig = require('./dbConfig')
const con = dbConfig.sqlCon

const checkUserExistence = (email) => new Promise((resolve, reject) => {
  const sqlQueryByMail = 'SELECT * FROM user WHERE email = ?;'
  con.query(sqlQueryByMail, email, (err, result, fields) => {
    if (err) {
      throw reject(err)
    }
    resolve(result)
  })
})

const createUser = (dataInput) => new Promise((resolve, reject) => {
  const sqlInsertUserInfo = 'INSERT INTO user (name, email, password, login) VALUES (?, ?, ?, ?)'
  con.query(sqlInsertUserInfo, dataInput, (err, result, fields) => {
    if (err) {
      throw reject(err)
    }
    resolve({ stat: 'ok' })
  })
})

module.exports = {
  checkUserExistence,
  createUser
}

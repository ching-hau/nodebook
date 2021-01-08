const mysql = require('mysql')
require('dotenv').config()

const mode = process.env.NODE_ENV


const transDbByMode = (mode) => {
  if(mode === 'test'){
    return process.env.DB_TEST
  } else {
    return process.env.DB
  }
}

const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: transDbByMode(mode),
  connectionLimit: process.env.LIMIT,
  waitForConnections: process.env.WAITFORCONNECTIONS
})

con.getConnection((err, connection) => {
  if (err) {
    throw err
  }
  console.log(`connecting to mysql in ${mode} envoronment, database ${transDbByMode(mode)} by pool successfully!`)
})

module.exports = {
  sqlCon: con
}

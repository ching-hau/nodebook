const mysql = require("mysql");
require("dotenv").config();

const con = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    connectionLimit: process.env.LIMIT,
    waitForConnections: process.env.WAITFORCONNECTIONS
})


con.getConnection((err, connection) =>{
    if (err) throw err;
    console.log("connecting to mysql by pool successfully!")
})

module.exports = {
    sqlCon : con
}
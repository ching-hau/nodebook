const dbConfig = require("./dbConfig")
const con = dbConfig.sqlCon;

const saveFileContent = (data) => {
    return new Promise((resolve, reject) => {
        let sqlInsertFileContent = "INSERT INTO user_file (user_email, file_name, file_content) VALUES (?, ?, ?);";
        let dataBinding = [data.user_email, data.file_name, data.file_content]
        con.query(sqlInsertFileContent, dataBinding, (err, result, fields) => {
            if(err) throw reject({stat: err});
            console.log("here")
            resolve({stat: "success"})
        })
    })
}


module.exports = {
    saveFileContent
}
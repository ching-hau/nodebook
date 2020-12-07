const dbConfig = require("./dbConfig")
const con = dbConfig.sqlCon;

const errFuncion = (err, errMessage, reject) => {
    if(err){
        reject(errMessage);
    }
}

const saveNewFileContent = (data) => {
    return new Promise((resolve, reject) => {
        let sqlInsertFileContent = "INSERT INTO user_file (user_email, file_name, file_content) VALUES (?, ?, ?);"
        let dataBinding = [data.user_email, data.file_name, data.file_content]
        const errMessage = { stat: "fail", project_id: 0 }
        con.getConnection((err, connection) => {
            errFuncion(err, errMessage, reject);
            console.log("connected to sql pool in fileDB successfully");
            connection.query(sqlInsertFileContent, dataBinding, (err, result, fields) => {
                errFuncion(err, errMessage, reject)
                let sqlGetInsertId = "SELECT LAST_INSERT_ID() AS project_id;";
                connection.query(sqlGetInsertId, (err, result, fields) => {
                    errFuncion(err, errMessage, reject)
                    resolve({ stat: "success", project_id: result[0].project_id });
                    connection.release();
                })
            });

        })
    })
}

const updateFileContent = (data) => {
    return new Promise((resolve, reject) => {
        let sqlCheckIdExistence = "SELECT id FROM user_file WHERE id = (?);"
        let sqlUpdateFileContent = "UPDATE user_file SET file_content = (?) WHERE id = (?);"
        let {project_id, file_content} = data;
        let errMessage = { stat: "fail"}
        con.getConnection((err, connection) => {
            connection.query(sqlCheckIdExistence, project_id, (err, result, fields) => {
                if(result){
                    let dataBinding = [file_content, project_id]
                    connection.query(sqlUpdateFileContent, dataBinding, (err, result, field) => {
                        errFuncion(err, errMessage, reject);
                        resolve({ stat: "success"});
                    })
                }else{
                    errFuncion(err, errMessage, reject);
                    reject({stat: "invalid id"})
                }
                connection.release();
            })
        });
    })
}

module.exports = {
    saveNewFileContent,
    updateFileContent
}

// SELECT LAST_INSERT_ID() AS file_id;

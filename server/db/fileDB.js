const dbConfig = require("./dbConfig")
const con = dbConfig.sqlCon;

const errFuncion = (err, errMessage, reject) => {
    if(errMessage === ""){
        errMessage = { stat: "fail"}
    }
    if(err){
        reject(errMessage);
    }
}

const saveNewFileContent = (data) => {
    return new Promise((resolve, reject) => {
        let sqlInsertFileContent = "INSERT INTO user_file (user_email, file_name, file_content, file_delete) VALUES (?, ?, ?, ?);"
        let dataBinding = [data.user_email, data.file_name, data.file_content, 0]
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
        console.log(project_id)
        con.getConnection((err, connection) => {
            connection.query(sqlCheckIdExistence, project_id, (err, result, fields) => {
                if(result){
                    let dataBinding = [file_content, project_id]
                    connection.query(sqlUpdateFileContent, dataBinding, (err, result, field) => {
                        errFuncion(err, "", reject);
                        resolve({ stat: "success"});
                    })
                }else{
                    errFuncion(err, "", reject);
                    reject({stat: "invalid id"})
                }
                connection.release();
            })
        });
    })
}

const getFileById = (id) => {
    return new Promise((resolve, reject) => {
        let sqlGetFileById = "SELECT * FROM user_file WHERE id = (?);";
        con.query(sqlGetFileById, id, (err, result, field) => {
            errFuncion(err, "", reject);
            if(result.length > 0){
                resolve(result);
            }else{
                errFuncion(err, "", reject);
                reject({stat: "invalid id"})
            }
            
        })
    })
}

// ()
const getAllProjectIdByUser = (user) => {
    return new Promise((resolve, reject) => {
        //let sqlGetProjectById = "SELECT id, file_name FROM user_file WHERE user_email = (?) AND file_delete != 1";
        let sqlGetProjectById = "SELECT id, file_name, file_delete FROM user_file WHERE user_email = (?);";
        con.query(sqlGetProjectById, user, (err, result, field) => {
            errFuncion(err, "", reject);
            resolve(result);
        })
    })
}

//getAllProjectIdByUser(111).then(result => console.log(result)).catch(err => console.log(err))

const updateFileById = (action, id) => {
    return new Promise((resolve, reject) => {
        let sqlDelterFileById = "UPDATE user_file SET file_delete = (?) WHERE id = (?)"
        let dataBinding;
        if(action === "delete"){
            dataBinding = [1, id]
        }else{
            dataBinding = [0, id]
        }
        con.query(sqlDelterFileById, dataBinding, (err, result, field) => {
            errFuncion(err, "", reject);
            resolve({stat: "success"});
        })
    })
}

const deleteFileById = (id) => {
    return new Promise((resolve, reject) => {
        let sqlDeleteFileById = "DELETE FROM user_file WHERE id = (?);";
        con.query(sqlDeleteFileById, id, (err, result, field) => {
            errFuncion(err, "", reject);
            resolve({stat:"success"})
        })
    })
}

function test (){
    console.log(1);

}


//deleteFileById(48).then(result => console.log(result)).catch(err => console.log(err))
//updateFileById("cancel", 27).then(result => console.log(result)).catch(err => console.log(err))
//getAllProjectIdByUser(111).then(result => console.log(result)).catch(err => console.log(err))

module.exports = {
    saveNewFileContent,
    updateFileContent,
    getFileById,
    getAllProjectIdByUser,
    updateFileById,
    deleteFileById
}

// SELECT LAST_INSERT_ID() AS file_id;

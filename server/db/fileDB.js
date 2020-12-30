/* eslint-disable prefer-promise-reject-errors */
const dbConfig = require('./dbConfig')
const con = dbConfig.sqlCon

const errFuncion = (err, errMessage, reject) => {
  if (errMessage === '') {
    errMessage = { stat: 'fail' }
  }
  if (err) {
    reject(errMessage)
  }
}

const saveNewFileContent = (data) => new Promise((resolve, reject) => {
  const sqlGetFileByName = 'SELECT id FROM user_file WHERE user_email = (?) AND file_name = (?)'
  const sqlInsertFileContent = 'INSERT INTO user_file (user_email, file_name, file_content, file_delete) VALUES (?, ?, ?, ?);'
  const dataBinding1 = [
    data.user_email,
    data.file_name
  ]
  const dataBinding2 = [
    data.user_email,
    data.file_name,
    data.file_content,
    0
  ]
  const errMessage = {
    stat: 'fail',
    project_id: 0
  }
  con.getConnection((err, connection) => {
    errFuncion(err, errMessage, reject)
    console.log('connected to sql pool in fileDB successfully')
    connection.query(sqlGetFileByName, dataBinding1, (err, result, fields) => {
      if (err) throw err
      if (result.length === 0) {
        connection.query(sqlInsertFileContent, dataBinding2, (err, result, fields) => {
          errFuncion(err, errMessage, reject)
          const sqlGetInsertId = 'SELECT LAST_INSERT_ID() AS project_id;'
          connection.query(sqlGetInsertId, (err, result, fields) => {
            errFuncion(err, errMessage, reject)
            resolve({
              stat: 'success',
              project_id: result[0].project_id
            })
            connection.release()
          })
        })
      } else {
        errFuncion(err, errMessage, reject)
        reject({ stat: 'repeated file name' })
        connection.release()
      }
    })
  })
})

const updateFileContent = (data) => new Promise((resolve, reject) => {
  const sqlCheckIdExistence = 'SELECT id FROM user_file WHERE id = (?);'
  const sqlUpdateFileContent = 'UPDATE user_file SET file_content = (?) WHERE id = (?);'
  const { project_id, file_content } = data
  con.getConnection((err, connection) => {
    if (err) {
      reject(err)
    }
    connection.query(sqlCheckIdExistence, project_id, (err, result, fields) => {
      if (err) {
        reject(err)
      }
      if (result) {
        const dataBinding = [
          file_content,
          project_id
        ]
        connection.query(sqlUpdateFileContent, dataBinding, (err, result, field) => {
          errFuncion(err, '', reject)
          resolve({ stat: 'success' })
        })
      } else {
        errFuncion(err, '', reject)
        reject({ stat: 'invalid id' })
      }
      connection.release()
    })
  })
})

const getFileById = (id) => new Promise((resolve, reject) => {
  const sqlGetFileById = 'SELECT * FROM user_file WHERE id = (?);'
  con.query(sqlGetFileById, id, (err, result, field) => {
    errFuncion(err, '', reject)
    if (result.length > 0) {
      resolve(result)
    } else {
      errFuncion(err, '', reject)
      reject({ stat: 'invalid id' })
    }
  })
})

// ()
const getAllProjectIdByUser = (user) => new Promise((resolve, reject) => {
  // let sqlGetProjectById = "SELECT id, file_name FROM user_file WHERE user_email = (?) AND file_delete != 1";
  const sqlGetProjectById = 'SELECT id, file_name, file_delete FROM user_file WHERE user_email = (?);'
  con.query(sqlGetProjectById, user, (err, result, field) => {
    errFuncion(err, '', reject)
    resolve(result)
  })
})

const updateFileById = (action, id) => new Promise((resolve, reject) => {
  const sqlDelterFileById = 'UPDATE user_file SET file_delete = (?) WHERE id = (?)'
  let dataBinding
  if (action === 'delete') {
    dataBinding = [
      1,
      id
    ]
  } else {
    dataBinding = [
      0,
      id
    ]
  }
  con.query(sqlDelterFileById, dataBinding, (err, result, field) => {
    errFuncion(err, '', reject)
    resolve({ stat: 'success' })
  })
})

const deleteFileById = (id) => new Promise((resolve, reject) => {
  const sqlDeleteFileById = 'DELETE FROM user_file WHERE id = (?);'
  con.query(sqlDeleteFileById, id, (err, result, field) => {
    errFuncion(err, '', reject)
    resolve({ stat: 'success' })
  })
})

const clearDeletedFileByUserMail = (userMail) => new Promise((resolve, reject) => {
  const sqlClearDeletedFile = 'DELETE FROM user_file WHERE file_delete = 1 AND user_email = (?);'
  con.query(sqlClearDeletedFile, userMail, (err, result, field) => {
    errFuncion(err, '', reject)
    resolve({ stat: 'success' })
  })
})

const shareToPublic = (id) => new Promise((resolve, reject) => {
  const endPoints = Date.now()
  const sqlAddFileToPublic = 'INSERT INTO public_file (file_id, endPoints) VALUES (?, ?);'
  const dataBinding = [
    id,
    endPoints
  ]
  con.query(sqlAddFileToPublic, dataBinding, (err, result, fields) => {
    errFuncion(err, '', reject)
    resolve({
      stat: 'success',
      file: endPoints,
      projectId: id
    })
  })
})

const cancelPublicShare = (id) => new Promise((resolve, reject) => {
  const sqlDeletePublicById = 'DELETE FROM public_file WHERE (file_id) = (?);'
  con.query(sqlDeletePublicById, id, (err, result, field) => {
    errFuncion(err, '', reject)
    resolve({ stat: 'success' })
  })
})

const getPublicData = (publicFileID) => new Promise((resolve, reject) => {
  const sqlGetPublicFile = 'SELECT file_id FROM public_file WHERE (endpoints) = (?);'
  con.query(sqlGetPublicFile, publicFileID, (err, result, field) => {
    errFuncion(err, '', reject)
    if (result.length > 0) {
      result[0].stat = 'success'
      resolve(result[0])
    } else {
      errFuncion(err, '', reject)
    }
  })
})

const checkPublicFile = (id) => new Promise((resolve, reject) => {
  const sqlCheckPublicById = 'SELECT * FROM public_file WHERE (file_id) = (?);'
  con.query(sqlCheckPublicById, id, (err, result, field) => {
    errFuncion(err, '', reject)
    resolve(result)
  })
})

module.exports = {
  saveNewFileContent,
  updateFileContent,
  getFileById,
  getAllProjectIdByUser,
  updateFileById,
  deleteFileById,
  shareToPublic,
  getPublicData,
  checkPublicFile,
  cancelPublicShare,
  clearDeletedFileByUserMail
}

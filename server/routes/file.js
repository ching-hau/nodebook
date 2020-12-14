const express = require("express");
const router = express.Router();
const fileDB = require("../db/fileDB");
const jwt = require('jsonwebtoken');
const signDB = require("../db/signDB");
require("dotenv").config();

const JWTKEY = process.env.JWT_KEY


router.post("/saveas", verifyToken, async (req, res) => {
    //let data = req.body
    let data = {
        "user_email":req.userMail,
        "file_name": req.body.file_name,
        "file_content": req.body.file_content
    }
    let resultConf = {
        project_id: "na",
        user_mail: req.userMail,
        file_name: data.file_name,
        file_content: data.file_content
    }
    try{
        let insertResult = await fileDB.saveNewFileContent(data);
        if(insertResult.stat === "success"){
            resultConf.project_id = insertResult.project_id;
            resultConf.stat = "success"
            res.status(200).send(resultConf);
        }
    } catch(err){
        resultConf.stat = err.stat;
        res.status(200).send(resultConf)
    }
});

router.post("/save", verifyToken, async (req, res) => {
    let data = req.body;
    let resultConf = {
        project_id: "na",
        user_mail: req.userMail,
        file_name: data.file_name,
        file_content: data.file_content
    }
    try{
        let updateResult = await fileDB.updateFileContent(data);
        if(updateResult.stat === "success"){
            console.log("saved the file successfully")
            resultConf.project_id = data.project_id;
            res.status(200).send(resultConf);
        }else{
            res.status(200).send(resultConf);
        }
    } catch(err){
        console.log(err)
    }

})

router.get("/files2", async (req, res) => {
    const {id}=req.query;
    let result = await fileDB.getFileById(id);
    let resultConf = {
        project_id: id,
        user_mail: result[0].user_email,
        file_name: result[0].file_name,
        file_content: result[0].file_content
    }
    res.status(200).send(resultConf)
});

router.post("/files", verifyToken, async (req, res) => {
    const {id}=req.query;
    let result = await fileDB.getFileById(id);
    if(req.userMail === result[0].user_email){
        let resultConf = {
            stat:"success",
            project_id: id,
            user_mail: result[0].user_email,
            file_name: result[0].file_name,
            file_content: result[0].file_content,
            file_delete: result[0].file_delete
        }
        res.status(200).send(resultConf)
    } else{
        res.status(200).send({stat: "invalid"})
    }

});

router.get("/allProjectsId", verifyToken, async (req, res) => {
    let userMail = req.userMail
    let allId = await fileDB.getAllProjectIdByUser(userMail);
    res.status(200).send(allId);
});





router.post("/user", verifyToken, async(req, res) => {
    let userMail = req.userMail;
    let allId = await fileDB.getAllProjectIdByUser(userMail);
    console.log(allId)
    res.status(200).send(allId);
})

router.post("/delete", verifyToken, async(req, res) => {
    let {projectID} = req.body;
    try{
        let deleteResult = await fileDB.updateFileById("delete", projectID);
        res.status(200).send(deleteResult);
    } catch(err){
        res.status(200).send(err);
    }
});

router.post("/recover", verifyToken, async(req, res) => {
    let {projectID} = req.body;
    try{
        let recover = await fileDB.updateFileById("recover", projectID);
        res.status(200).send(recover);
    } catch(err){
        res.status(200).send(err);
    }
});

router.post("/deleteForever", verifyToken, async(req, res) => {
    let {projectID} = req.body;
    try{
        let deleteForeverResult = await fileDB.deleteFileById(projectID);
        console.log(deleteForeverResult)
        res.status(200).send(deleteForeverResult);
    } catch(err){
        res.status(200).send(err);
    }
})

function verifyToken (req, res, next) {
    let {pctoken} = req.headers;
    jwt.verify(pctoken, JWTKEY, (err, authData) => {
        if(err) {
            console.log(err);
            res.status(200).send({"stat": "fail token"})
        }else{
            userMail = authData.userInfo.user.email;
            req.userMail = userMail;
            console.log("done")
            next();
        }
    });
}


module.exports = router;



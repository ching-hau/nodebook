const express = require("express");
const router = express.Router();
const fileDB = require("../db/fileDB");


router.post("/saveas", async (req, res) => {
    let data = req.body
    let resultConf = {
        project_id: "na",
        user_mail: data.user_email,
        file_name: data.file_name,
        file_content: data.file_content
    }
    let insertResult = await fileDB.saveNewFileContent(data)
    if(insertResult.stat === "fail"){
        res.status(200).send(resultConf)
    }else if(insertResult.stat === "success"){
        resultConf.project_id = insertResult.project_id
        res.status(200).send(resultConf)
    }
});

router.post("/save", async (req, res) => {
    let data = req.body;
    console.log(data)
    let resultConf = {
        project_id: "na",
        user_mail: data.user_email,
        file_name: data.file_name,
        file_content: data.file_content
    }
    try{
        let updateResult = await fileDB.updateFileContent(data);
        if(updateResult === "success"){
            resultConf.project_id = data.project_id;
            res.status(200).send(resultConf);
        }else{
            res.status(200).send(resultConf);
        }
    } catch(err){
        console.log(err)
    }

})

module.exports = router;



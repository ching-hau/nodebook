const express = require("express");
const router = express.Router();
const fileDB = require("../db/fileDB");


router.post("/save", (req, res) => {
    let data = req.body
    fileDB.saveFileContent(data)
    .then(result => console.log(result.stat))
})

module.exports = router;



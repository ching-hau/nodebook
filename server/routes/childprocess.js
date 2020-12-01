const express = require("express");
const router = express.Router();
const cp = require("../controllers/childProcessCon");


router.post("/test", async (req, res) => {
    let {content, file} = req.body;
    let path = `OtherCode/${file}.js`
    await cp.writeFile(content, path);
    let result = await cp.runChildProcess(path);
    res.status(200).send({result: result})
})


module.exports = router;
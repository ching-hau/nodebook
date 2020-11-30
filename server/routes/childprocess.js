const express = require("express");
const router = express.Router();
const childProcess = require('child_process');
const fs = require('fs');
const he = require('he');

function extractError(err){
    let lines = err.split('\n')
    return lines[1]+"\n"+lines[4]
}

const runChildProcess = (path) => {
    return new Promise((resolve, reject) => {
        console.log("run the code!");
        let command = "node " + path;
        let workerProcess = childProcess.exec(command);
        let output = ''
        workerProcess.on("exit", (data) => {
            console.log("exit the code")
            deleteFile(path);
        });
        workerProcess.stdout.on("data", (data) => {
            output += data;
        });
        workerProcess.stderr.on("data", (data) => {
            resolve(extractError(data));
        });
        workerProcess.stdout.on("end", () => {
            resolve(output);
        });
        setTimeout(()=> {
            console.log("start to kill");
            workerProcess.kill()

        }, 2000)
    });
}

// runChildProcess("OtherCode/kk.js").then(result=> {console.log(result)})

const writeFile = (content, path) => {
    return new Promise((resolve, reject) => {
        let newContent = he.decode(content.replace(/<br>/g,""))
        fs.writeFile(path, newContent, (err) => {
            if(err) reject(err);
            let message = path + " was created successfully."
            console.log(message)
            resolve();
        })
    })
}

const deleteFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if(err) reject(err);
            let message = path + " was deleted successfully."
            console.log(message)
            resolve();
        });
    });
}

router.post("/test", async (req, res) => {
    let {content, file} = req.body;
    console.log(content)
    let path = `OtherCode/${file}.js`
    await writeFile(content, path);
    let result = await runChildProcess(path);
    res.status(200).send({result: result})
})

module.exports = router;
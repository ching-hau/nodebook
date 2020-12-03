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
        setTimeout(()=> {
            console.log("start to kill");
            workerProcess.kill();
            //deleteFile(path);
            reject("This code run too long");
        }, 5000)
        // workerProcess.on("exit", (data) => {
        //     console.log("exit the code")
        //     //deleteFile(path);
        // });
        workerProcess.stdout.on("data", (data) => {
            output += data;
        });
        workerProcess.stderr.on("data", (data) => {
            resolve(extractError(data));
        });
        workerProcess.stdout.on("end", () => {
            resolve(output);
        });
    });
}

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

module.exports = {
    extractError,
    runChildProcess,
    writeFile,
    deleteFile
}
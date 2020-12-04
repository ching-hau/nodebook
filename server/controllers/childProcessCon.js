const childProcess = require('child_process');
const fs = require('fs');
const he = require('he');
require("dotenv").config();
const emmitter = require('events').EventEmitter();;



function extractError(err){
    let lines = err.split('\n')
    if(lines[1] == "<--- Last few GCs --->"){
        return "Your code result is out of memory -10mb.";
    }else if(lines[4] == "RangeError: Maximum call stack size exceeded"){
        return lines[4];
    }else{
        return lines[1]+"\n"+lines[4];
    }
}

const runTestChidProcess = (path) => {
    return new Promise((resolve, reject) => {
        console.log("Run test Child Process");
        let command = `node ` + path + " > /Users/nickchu/Desktop/nodebookCode/aaa.txt";
        let output = '';
        let testChild = childProcess.exec(command);
        console.log(`initial exitcode is ${testChild.exitCode}`)
        console.log(`initial PID is ${testChild.pid}`)
        setTimeout(() => {
            console.log("start to kill test child")
            testChild.exitCode = 1;
            //process.kill(`${testChild.pid}+1`)
            console.log(`exitcode after settime out is ${testChild.exitCode}`)
        }, 1000);
        testChild.on("exit", () => {
            console.log("Exit the code successfully");
            resolve(testChild.exitCode);
        });
        testChild.stdout.on("data", (data) => {
            output += data;
        });
        testChild.stdout.on("end", (data) => {
            resolve("End the process " + testChild.exitCode)
        });


    })
}

// let path = `/Users/nickchu/Desktop/nodebookCode/aaa.js`

// runTestChidProcess(path).then(result => {console.log(result)})

const runChildProcess = (path) => {
    return new Promise((resolve, reject) => {
        console.log("run the code!");
        let command = "node --max-old-space-size=10 " + path;
        let workerProcess = childProcess.exec(command);
        let output = ''
        setTimeout(()=> {
            console.log("start to kill");
            workerProcess.kill();
            workerProcess.exitCode = 1;
            console.log(`${path} exit reject code: ${workerProcess.exitCode}`)
            reject("This code run too long");
        }, 10000)
        workerProcess.on("exit", () => {
            console.log("exit the code successfully")
            console.log(`${path} exit resolve code: ${workerProcess.exitCode} in exit`)

            //deleteFile(path);
        });
        workerProcess.stdout.on("data", (data) => {
            output += data;
        });
        workerProcess.stderr.on("data", (data) => {
            resolve(extractError(data));
        });
        workerProcess.stdout.on("end", () => {
            console.log(`${path} exit resolve code: ${workerProcess.exitCode} in end`)
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
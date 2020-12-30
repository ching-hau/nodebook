const cp = require("./childProcessCon");
const jwt = require('jsonwebtoken');
const JWTKEY = process.env.JWT_KEY;
const ROOMKEY = process.env.ROOMKEY;

const writeContentToFile = async (file, content) => {
    let filePath = process.env.PROCESS_PATH +`${file}.js`;
    await cp.writeFile(content, filePath);
    return filePath;
}

const summarizeResult = async (file1Path, file2Path) => {
    let file1Result = cp.runChildProcess(file1Path);
    let file2Result = cp.runChildProcess(file2Path);
    let allResult = await Promise.all([file1Result, file2Result]);
    if(allResult[1]){
        return allResult[1].replace(allResult[0],"").toString();
    }else{
        return allResult[0].toString();
    }
}

const socketChild = (socket) => {

    let roomByProjectId;
    let roomByUser;

    socket.on("start to connect", (msg) => {
        roomByProjectId = msg.projectID;
        socket.join(roomByProjectId);
        socket.emit("join room", `join room ${msg}`);
        socket.to(roomByProjectId).emit("update or not", "any update?");


        jwt.verify(msg.token, JWTKEY, (err, authData) => {
            roomByUser = authData.email + ROOMKEY;
            socket.join(roomByUser);
        });
    });

    socket.on("the latest status", (result) => {
        socket.to(roomByProjectId).emit("update the content", result)
    });

    socket.on("new project connected", (msg) => {
        jwt.verify(msg.token, JWTKEY, (err, authData) => {
            if(err){
                socket.emit("please get the new token")
            }else{
                roomByUser = authData.email + ROOMKEY
                console.log("join")
                socket.join(roomByUser);
            }
        });
    });

    socket.on("click to change mode", (msg) => {
        if(msg === "normal"){
            socket.to(roomByUser).emit("change mode syn", {target:{className:"off"}})
        } else{
            socket.to(roomByUser).emit("change mode syn", {target:{className:"on"}})
        }
    });

    socket.on("update file", () => {
        socket.to(roomByUser).emit("update user list");
    })

    socket.on("send code", async (data) => {
        let {content1, content2, file1, file2, index} = data;
        let file1Path = await writeContentToFile(file1, content1);
        let file2Path = await writeContentToFile(file2, content2);
        try{
            let summarizedResult = await summarizeResult(file1Path, file2Path);
            socket.emit("send reult", {result: summarizedResult, index: index})
        } catch(err){
            socket.emit("send reult", {result: err, index: index})
        }
    })
}

module.exports = socketChild;
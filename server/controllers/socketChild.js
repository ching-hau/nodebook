const cp = require("./childProcessCon");
const jwt = require('jsonwebtoken');
const JWTKEY = process.env.JWT_KEY


const socketChild = (socket) => {

    // This part is to show content synchronously in the same computer. 
    let room;
    let userRoom;
    socket.on("start to connect", (msg) => {
        room = msg.projectID;
        socket.join(room)
        socket.emit("join room", `join room ${msg}`)
        socket.to(room).emit("update or not", "any update?")
        socket.join(socket.handshake.address);
        jwt.verify(msg.token, JWTKEY, (err, authData) => {
            userRoom = authData.email + "appworks"
            socket.join(userRoom);
        });
    });
    socket.on("the latest status", (result) => {
        socket.to(room).emit("update the content", result)
    });
    socket.on("new project connected", (msg) => {
        jwt.verify(msg.token, JWTKEY, (err, authData) => {
            if(err){
                socket.emit("please get the new token")
            }else{
                userRoom = authData.email + "ifjiejfi"
                console.log("join")
                socket.join(userRoom);
            }
        });
    });
    socket.on("click to change mode", (msg) => {
        if(msg === "normal"){
            socket.to(userRoom).emit("change mode syn", {target:{className:"off"}})
        } else{
            socket.to(userRoom).emit("change mode syn", {target:{className:"on"}})
        }
    });
    socket.on("update file", () => {
        socket.to(userRoom).emit("update user list");
    })

    // This part is to transfer the code result. 
    socket.on("send code", async (data) => {
        let {content1, content2, file1, file2, index} = data;
        let path1 = process.env.PROCESS_PATH +`${file1}.js`;
        let path2 = process.env.PROCESS_PATH +`${file2}.js`;
        await cp.writeFile(content1, path1);
        await cp.writeFile(content2, path2);
        try{
            let promise1 = cp.runChildProcess(path1);
            let promise2 = cp.runChildProcess(path2);
            let allResult = await Promise.all([promise1, promise2]);
            let result;
            if(allResult[1]){
                result = allResult[1].replace(allResult[0],"").toString();
            }else{
                result = allResult[0].toString();
            }
            console.log(result)
            socket.emit("send reult", {result: result, index: index})
        } catch(err){
            socket.emit("send reult", {result: err, index: index})
        }
    })
}

module.exports = socketChild;
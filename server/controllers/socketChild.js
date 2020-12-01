const cp = require("./childProcessCon");

const socketChild = (socket) => {
    socket.on("send code", async (data) => {
        let {content, file} = data;
        let path = `/Users/nickchu/Desktop/nodebookCode/${file}.js`;
        await cp.writeFile(content, path);
        try{
            let result = await cp.runChildProcess(path);
            socket.emit("send reult", result)
        } catch(err){
            socket.emit("send reult", err)
        }
    })
}

module.exports = socketChild;
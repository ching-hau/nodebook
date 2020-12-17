function goForSocket(){
    console.log("name")
}

const goForSocket2 = () => {
    return new Promise((resolve, reject) => {
        resolve("Finsh Promise goSocket2");
    })
}



const socketChat = (socket) => {
    const users = {}
    const rooms = {}
    socket.emit("new")
    socket.on("new-room", (room)=>{
        rooms[socket.id] = room;
    })
    socket.on("tokem", (tokem)=>{
        console.log(tokem)
    })

    socket.on("enterText", (text) => {
        console.log(text);
        socket.to(rooms[socket.id]).emit("insertText", text);
    })
    socket.on("new-user", (name) => {
        console.log(name)
        users[socket.id] = name;
        let newRoom = rooms[socket.id]
        socket.join(newRoom)
        socket.to(rooms[socket.id]).emit("user-connected", name);
    })
    socket.on("chat message", (message) => {
        socket.to(rooms[socket.id]).emit("chat message", {message: message, name: users[socket.id]});
    });
    socket.on("disconnect", () => {
        socket.to(rooms[socket.id]).emit("user-disconnected", users[socket.id]);
        delete users[socket.id];
    })
    socket.on("test", async () => {
        console.log("test for socket io")
        let result = await goForSocket2();
        socket.emit("test2", result);
    });
}

module.exports = socketChat;
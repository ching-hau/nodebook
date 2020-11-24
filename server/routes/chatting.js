const io = require("socket.io")(server);

const users = {}
const rooms = {}

io.on("connection", (socket) => {
    socket.on("new-room", (room)=>{
        
        rooms[socket.id] = room;
    })
    socket.on("new-user", (name) => {
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
});

module.exports = router;
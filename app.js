const express = require("express");
const app = express();


require("dotenv").config();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const dbConfig = require("./server/db/dbConfig");
const bodyParser= require('body-parser');



const con = dbConfig.sqlCon;
const port = process.env.PORT

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


const signRouter = require("./server/routes/sign")

app.use("/sign", signRouter)



app.get('/', (req, res) => {
    res.redirect('/chatting.html');
})


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

server.listen(port, () => {
    console.log(`Programming Chat is running on port ${port}!`)
});


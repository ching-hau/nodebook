const express = require("express");
const app = express();
require("dotenv").config();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const dbConfig = require("./server/db/dbConfig");
const bodyParser= require('body-parser');

const socketChild = require('./server/controllers/socketChild');
// const socketChat = require('./server/controllers/chatting');
io.on('connection', socketChild);
const con = dbConfig.sqlCon;
const port = process.env.PORT

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const signRouter = require("./server/routes/sign")
const childprocessRouter = require("./server/routes/childprocess")

app.use("/sign", signRouter)
app.use("/childprocess", childprocessRouter)

//io.on('connection', socketListener);
server.listen(port, () => {
    console.log(`NODEBOOK is running on port ${port}!`)
});


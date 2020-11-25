const express = require("express");
const app = express();


require("dotenv").config();
const dbConfig = require("./server/db/dbConfig");
const bodyParser= require('body-parser');



const con = dbConfig.sqlCon;
const port = process.env.PORT

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


const signRouter = require("./server/routes/sign")

app.use("/sign", signRouter)





app.listen(port, () => {
    console.log(`Programming Chat is running on port ${port}!`)
});


const express = require("express");
const router = express.Router();
const signDB = require("../db/signDB");
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const crypto = require('crypto');
require("dotenv").config();

const JWTKEY = process.env.JWT_KEY

const checkThirdPartSignInStatus = async (req) => {
    let {group, access_token} = req.body;
    let url;
    if(group == "facebook"){
        url = 'https://graph.facebook.com/me?fields=id,name,email&access_token=' + access_token
    }else if (group == "google"){
        url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + access_token
        console.log("here111")
    }
    let userInfo = await fetch(url).then(result => {return result.json()})
    let dbResult = await signDB.checkUserExistence(userInfo.email)
    let payLoad;
    if(dbResult.length > 0){
        payLoad = dbResult[0];
    }else{
        await signDB.createUser([userInfo.name, userInfo.email, "na", group])
        let updateDBResult = await signDB.checkUserExistence(userInfo.email)
        payLoad = updateDBResult[0];
    }
    console.log(payLoad)
    return {stat:"Welcome to programing chatting!", user: payLoad}
}


const checkNativeSignIn = async (req) => {
    let {email, password}=req.body;
    let userInfo = await signDB.checkUserExistence(email);
    const hash = crypto.createHash('sha256');
    hash.update(password);
    let encpPwd=hash.digest('hex');
    console.log(userInfo[0].password)
    console.log(encpPwd)
    if(userInfo.length == 0){
        return {stat:"Please sign up first!", user:"na"};
    }else if(userInfo[0].login == "facebook"){
        console.log("facebook");
        return {stat:"This mail is registered through facebook!", user:"na"};
    }else if(userInfo[0].password == encpPwd){
        console.log("good");
        return {stat:"Welcome to programing chatting!", user: userInfo[0]}
    }else{
        return {stat:"Wrong Password!", user:"na"};
    }
    
}


router.post("/signup", async (req, res) => {
    let {name, email, password}=req.body;
    const hash = crypto.createHash('sha256');
    hash.update(password);
    let encpPwd=hash.digest('hex');
    let userExisted = await signDB.checkUserExistence(email);
    if(userExisted.length > 0){
        res.status(200).send({stat:"This mail has been registered!"});
    }else{
        await signDB.createUser([name, email, encpPwd, "native"]);
        res.status(200).send({stat:"Welcome to programing chatting!"});
    }
})

router.post("/signin", async (req, res) => {
    let userInfo;
    let {group} = req.body
    console.log(req.body)
    if((group == "facebook" ||group == "google")){
        userInfo = await checkThirdPartSignInStatus(req);
        console.log("here")
    }else if(group == "native"){
        userInfo = await checkNativeSignIn(req);
        console.log("native")
    }else{
        userIno = {stat:"na", user:"na"}
    }

    if(userInfo.user == "na"){
        return res.status(200).json(userInfo);
    }else{
        let pcToken = jwt.sign({userInfo}, JWTKEY, { expiresIn: 360 });
        let {id, name, email } = userInfo.user;
        return res.status(200).json({
            stat: "success",
            user: {
                id: id,
                name: name,
                email: email
            },
            pcToken: pcToken
        });
    }
    
});

module.exports = router;
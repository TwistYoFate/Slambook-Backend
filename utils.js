// Utility functions for use in the project
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require("dotenv").config()

function CustomResObj(msg=null,isSuccessful=false,payload=null){
    //call this function using new operator
    this.msg=msg;
    this.isSuccessful=isSuccessful;
    this.payload=payload;
    //it will automatically return this
}

const transporter = nodemailer.createTransport({
    port: 465,
    host: process.env.SMTP_HOST,
    auth:{
        user:process.env.SMTP_USER_ID,
        pass: process.env.SMTP_USER_PASS,
    },
    secure:true,
})

//middlewares

async function verifyToken(req,res,next){
    let token = null;
    token = req.headers['authorization'].split(' ')[1];
    console.log("token in verify func",token);
    if(!token){
        return res.status(401).json({message:"Unauthorized",isAuthorised:false});
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(401).json({message:"Unauthorized",isAuthorised:false});
        }
        req.authorizedUser=user.username;
        req.token = token;
    })
    next();
}

module.exports = {
    CustomResObj,
    verifyToken,
    transporter,
}
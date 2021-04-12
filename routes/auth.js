/*
    Description : Handles the api routes for Authorization and Authentication
    Content:
        Routes : /signup
                 /login
                 /logout
                 /unregister
                 /update
        Middlewares : 
                      - verifyToken
                      - authenticationCheck
*/
const express = require("express")
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {userObj} = require('../database/userObj')
const dao = require('../database/dao')
const nodemailer = require('nodemailer')

//Importing middlewares/utils
const {CustomResObj,verifyToken, transporter} = require('../utils')


//Importing Schemas to be used
const {Users} = require('../database/models')

//Initializing Router
const router = express.Router()

// Routes for base = "auth/"

//signup user
//login user
//relogin
//logout user
//unregister user
//update user
//password reset

// Signup user
router.post("/signup", async (req,res)=>{

    const usernameTaken = await dao.isValueAlreadyTaken(Users,"username",req.body.username);
    const emailTaken = await dao.isValueAlreadyTaken(Users,"email",req.body.email);
    if(usernameTaken || emailTaken){
        if(usernameTaken) res.status(422).json(new CustomResObj("Username already taken."));
        if(emailTaken) res.status(422).json(new CustomResObj("Email already registered."));
    }

    const user = new Users({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        username : req.body.username,
        email : req.body.email,
        password : bcryptjs.hashSync(req.body.password,parseInt(process.env.SALT_ROUNDS)),
    })

    try{
        // Save New User to database
        const newUser = await user.save();
        res.status(201).json(new CustomResObj("User registered successfully.",true));
    }catch(error){
        res.json(new CustomResObj(error));
    };
})



// Login user, check credentials and return token
router.post("/login",authenticationCheck,async (req,res)=>{
    console.log(req.body.sessionLength)
    console.log(req.body.sessionLength+"h")
    console.log(req.body)
    if(req.authenticatedUser){
        const user = req.authenticatedUser;
        const returnUser = new userObj(
            user.username,
            user.email,
            user.firstName,
            user.lastName,
            false
        );

        jwt.sign({ username:returnUser.username,timestamp:Date.now() }, process.env.SECRET_KEY,{expiresIn:req.body.sessionLength+"h"},function(err, token) {
            if(err){console.log(err);return res.status(500).json(new CustomResObj("Token Error"))} 
            return res.status(200)
            .json(
                new CustomResObj("Logged in successfully",true,{token,user:returnUser})
            );   
        });
    }
    else{
        return res.status(500).json(new CustomResObj("Unable to login."));
    }

})

// Relogin user via the token
router.get("/relogin",verifyToken,async (req,res)=>{
    //token is verified so get the username extracted from token
    const username = req.authorizedUser
    console.log("uname, ",username)
    //use the username to fetch the user details
    let user = null;
    try {
        user = await dao.getDocumentByValue(Users,"username",username);
        console.log(user)
        if(!user){
            throw error;
        }
    } catch (error) {
        return res.status(401).json(new CustomResObj("Unauthenticated user."))
    }
    const returnUser = new userObj(
        user.username,
        user.email,
        user.firstName,
        user.lastName,
        false
    );
    try {
        return res.status(200)
        .json(
            new CustomResObj("Relogged in successfully",true,{token:req.token,user:returnUser})
        );   
    } catch (error) {
        return res.status(500).json(new CustomResObj("Unable to Relogin."));
    }
})

//Logout
router.get("/logout",(req,res)=>{
    res.clearCookie('token');
    res.status(200).json(new CustomResObj("Logged out successfully",true));
})

//unregister user
router.delete("/unregister",verifyToken,async (req,res)=>{
    let dbUser = null;
    try {       
        dbUser = await dao.getDocumentByValue(Users,"username",req.authorizedUser);
        if(dbUser){
            await dbUser.remove();
            return res.status(200).json(new CustomResObj("User unregistered successfully.",true));
        }
        else{
            throw error;
        }
    } catch (error) {
        return res.status(500).json(new CustomResObj("Unable to delete the user."))
    }
})

//Update User
router.patch("/update",verifyToken,async (req,res)=>{
    const username = req.authorizedUser
    let dbUser = null;
    try {
        console.log(username);
        dbUser = await dao.getDocumentByValue(Users,"username",username);
        console.log(dbUser)
        if(dbUser === null){
            throw 'error';
        }
    } catch (error) {
        res.status(500).json(new CustomResObj("Unable to fetch user from Database"));
    }

    const pass = req.body.password?bcryptjs.hashSync(req.body.password,parseInt(process.env.SALT_ROUNDS)):false;

    dbUser.firstName = req.body.firstName?req.body.firstName:dbUser.firstName;
    dbUser.lastName = req.body.lastName?req.body.lastName:dbUser.lastName;
    dbUser.username = req.body.username?req.body.username:dbUser.username;
    dbUser.email = req.body.email?req.body.email:dbUser.email;
    dbUser.password = pass?pass:dbUser.password;

    try {
        const updatedUser = await dbUser.save();
        const returnUser = new userObj(updatedUser.username, updatedUser.email, updatedUser.firstName,updatedUser.lastName,false);
        if(updatedUser!==null)
            return res.status(200).json(new CustomResObj("User updated successfully",true,{user:returnUser}));
        else
            throw error;
    } catch (error) {
        return res.status(500).json(new CustomResObj("Unable to update the user."));
    }
})

router.post("/reset",async (req,res)=>{
    const newPass = bcryptjs.hashSync(req.body.email+'_'+Date.now().toString(),parseInt(process.env.SALT_ROUNDS))
    const newPassHash = bcryptjs.hashSync(newPass,parseInt(process.env.SALT_ROUNDS))
    const mailData = {
        from: 'echoblaze13@gmail.com',
        to: req.body.email,
        subject: 'New Password for reset',
        text: `Your new password`,
        html:`Your new password for account on <h2><a href="www.deepanshuyadav.xyz/slambook/home">Slambook</a></h2>
        is <h4>"${newPass}"<h4>`
    }
    try{
        let newUser = await dao.getDocumentByValue(Users,"email",req.body.email);
        if(newUser){
            newUser.password = newPassHash; 
            newUser.save();

            transporter.sendMail(mailData,(error,info)=>{
                if(error){
                    console.log(error)
                    return res.status(500).json(new CustomResObj("Unable to send mail"));
                }
                res.status(200).json(new CustomResObj("Mail sent successfully",true,info))
            })
        }
        else
            throw 'error';
    }catch(error){
        console.log(error)
        return res.status(500).json(new CustomResObj("Unable to reset password before mail."));
    }
})

module.exports = router


//-------------------------------------MIDDLEWARES-----------------------------------------

async function authenticationCheck(req,res,next){
    let dbUser = null;
    let payload = {...req.body};
    console.log("auth ",payload)
    try {
        dbUser = await dao.getDocumentByValue(Users,"username",payload.username);
        if(dbUser && payload){
            let x = bcryptjs.compareSync(payload.password,dbUser.password);
            if(!x){
                throw error;
            }
        }
        else{
            throw error;
        }
    } catch (error) {
        return res.status(401).json(new CustomResObj("Unauthenticated user."))
    }
    req.authenticatedUser = dbUser;
    next();
}
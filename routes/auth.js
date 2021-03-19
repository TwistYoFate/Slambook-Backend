const express = require("express")
const crypt = require('../crypt')
// const dao = require("../database/dao")

//Importing Schemas to be used
const Users = require('../database/models')

//Initializing Router
const router = express.Router()

// Routes for base = "auth/"

//register user
//login user
//logout user
//unregister user

//register user
router.post("/signup", async (req,res)=>{
//    const output = dao.createRecord("user",req.body);
//    if(output.message == "success")
//         return res.json({message:`Successfully registered user ${output.data.name}`})
//    else
//         return res.json(output);

    const user =new Users({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        username : req.body.username,
        email : req.body.email,
        password : crypt.syncPassHash(req.body.password),
    })

    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch(error){
        res.json(error);
    };
})

//get user by id
router.get("/user/:id",getUserByIdMiddleware,(req,res)=>{
    // const output = dao.getRecordById("user",req.params.id);
    // if(output.message=="success"){
    //     return res.json({message:`deleted user with id ${req.params.id} & ${output.data}`})
    // }
    const returnUser = {
        username:req.user.username,
        email:req.user.email
    }
    return res.status(200).json(returnUser);
})

//unregister user
router.delete("/user/:id",getUserByIdMiddleware,async (req,res)=>{
    // const output = dao.deleteRecordById("user",req.params.id);
    // if(output.message=="deleted"){
    //     return res.json({message:`deleted user with id ${req.params.id}`})
    // }
    try {
        await req.user.remove();
        return res.status(200).json({message:`deleted user`});
    } catch (error) {
        return res.status(500).json({message:`Unable to delete the user.`})
    }
})

router.patch("/user/:id",getUserByIdMiddleware, async (req,res)=>{
    const pass = req.body.password?crypt.syncPassHash(req.body.password):false;

    req.user.firstName = req.body.firstName?req.body.firstName:req.user.firstName;
    req.user.lastName = req.body.lastName?req.body.lastName:req.user.lastName;
    req.user.username = req.body.username?req.body.username:req.user.username;
    req.user.email = req.body.email?req.body.email:req.user.email;
    req.user.password = pass?pass:req.user.password;

    try {
        const updatedUser = await req.user.save();
        if(updatedUser!==null)
            return res.status(200).json({message:`updated user`});
        else
            throw error;
    } catch (error) {
        return res.status(500).json({message:`Unable to update the user.`})
    }
})



//get all user
router.get("/test/allusers",(req,res)=>{
    const output = dao.getAllRecords("user");
    console.log(output)
    if(output.message=="success"){
        return res.json(output.data)
    }
    else{
        return res.json(output)
    }
})

module.exports = router


//middleware

async function getUserByIdMiddleware(req,res,next){
    let user;
    try {        
        user = await Users.findById(req.params.id)
        if(user==null){
            return res.status(404).json("User not found.");
        }
    } catch (error) {
        return res.status(500).json({message:error})
    }
    req.user = user;
    next();
}
const express = require("express")

//Importing middlewares and utils
const {CustomResObj,verifyToken} = require("../utils")


//Importing Schemas to be used
const {Blogs} = require('../database/models')
const {blogObj}  = require('../database/blogObj')

//Initializing Router
const router = express.Router()


// Routes for base = "blogs/"

//get all blogs
//create blog
//delete blog
//update blog

// Get all blogs
router.get('/',(req,res)=>{
    res.json(blogs);
})

//create blog
router.post('/create',verifyToken,async (req,res)=>{
    const username = req.authorizedUser;
    const payload = {...req.body};
    const newBlog = new blogObj(username,payload.title,payload.author,payload.body,payload.likes)
    let returnBlog = null;
    try {
        returnBlog = new Blogs(newBlog);
        if(returnBlog !== null){
            returnBlog = await returnBlog.save(); 
            res.status(201).json(new CustomResObj("Blog created successfully",true,{blog:returnBlog}));
        }
        else{
            throw error;
        } 
    } catch (error) {
        res.status(500).json(new CustomResObj("Unable to save blog"))
    }
})

//delete blog
router.delete('/delete',verifyToken,async (req,res)=>{
    const bid = req.body.id;
    const username = req.authorizedUser;
    let dbBlog = null;
    try {
        dbBlog = await Blogs.findById(bid);
        if(dbBlog !== null && (dbBlog.username == username)){
            let isDeleted = await dbBlog.remove();
            if(isDeleted)
                res.status(200).json(new CustomResObj("Blog deleted successfully",true));
            else
                throw error;     
        }
        else{
            throw error;
        }
    } catch (error) {
        res.status(500).json(new CustomResObj("Unable to delete blog"));
    }
    //verified by token and get username from the token
    //get id and fetch blog with id
    //if username in blog == username from token -> delete blog and return else return error
})

//update blog
router.patch('/update',verifyToken,async (req,res)=>{
    // const bid = req.params.id;
    const username = req.authorizedUser;
    const payload = {...req.body};
    let dbBlog = null;
    try {
        dbBlog = await Blogs.findById(payload.id);
        if(dbBlog!==null){
            payload.title?dbBlog.title=payload.title:null;
            payload.body?dbBlog.body=payload.body:null;
            payload.likes?dbBlog.likes=payload.likes:null;
            dbBlog.timestamp = Date.now();
        }
        if(dbBlog !== null && (dbBlog.username == username)){
            let updatedBlog = await dbBlog.save();
            if(updatedBlog)
                res.status(200).json(new CustomResObj("Blog updated successfully",true,{blog: updatedBlog}));
            else
                throw error;     
        }
        else{
            throw error;
        }
    } catch (error) {
        res.status(500).json(new CustomResObj("Unable to update blog"));
    }
})


//Export
module.exports = router
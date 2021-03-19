const express = require("express")
const blogs = require("../db")

//Initializing Router
const router = express.Router()


//Routes

// Get all blogs
router.get('/',(req,res)=>{
    res.json(blogs);
})

//Get single blog
router.get('/:id',(req,res)=>{
    const found = blogs.some(blog => blog.id === parseInt(req.params.id))
    if(found){
        res.json(blogs.filter(blog=> blog.id === parseInt(req.params.id)))
    }
    else
        res.status(400).json({msg:"Nothing"})
})

//create single blog
router.post('/',(req,res)=>{
    const newBlog = {
        id:Math.ceil(Math.random()*1000),
        name:req.body.name,
        msg:req.body.msg,
        status:"active"
    }

    if(!req.body.name || (!req.body.msg))
        return res.send("Form filled incomplete")
    blogs.push(newBlog)
    res.json(newBlog)
})

//update single blog
router.put('/:id',(req,res)=>{
    const found = blogs.some(blog => blog.id === parseInt(req.params.id));
    if(found){
        const updBlog = req.body;
        blogs.forEach(blog=>{
        if(blog.id===parseInt(updBlog.id)){
            blog.name=updBlog.name?updBlog.name:blog.name;
            blog.msg=updBlog.msg?updBlog.msg:blog.msg;
        }
        res.json({msg:"Blog Updated"});
        });
    }
    else{
        res.status(400).json({msg:"Doesn't exist"})
    }
    
})

//delete single blog
router.delete('/:id',(req,res)=>{
    const found = blogs.some(blog => blog.id === parseInt(req.params.id));
    if(found){
        res.json(blogs.filter(blog=> blog.id !== parseInt(req.params.id)))
    }
    else{
        res.json("Not deleted")
    }
})

//Export
module.exports = router
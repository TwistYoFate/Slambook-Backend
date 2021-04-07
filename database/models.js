const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    registeredOn:{
        type:Date,
        required:true,
        default:Date.now,
    }
})


const blogSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    likes:{
        total:{
            type:Number,
            default:0,
        },
        likedBy:{
            type:Map,
            default:{}
        }
    },
    timestamp:{
        type:Date,
        default:Date.now()
    },
})

module.exports = {
    Users:mongoose.model('Users',userSchema),
    Blogs:mongoose.model('Blogs',blogSchema),
}
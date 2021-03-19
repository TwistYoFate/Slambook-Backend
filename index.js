require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');

// const blogs = require('./db')
// const md5 = require("md5")
// const createPassword = require("./crypt")
const app = express();


//cors permission
app.use(cors())


mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));


// Home Route
app.get('/',(req,res)=>{
    res.send('Hello');
})

//Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))



// Additional routes
app.use('/auth',require('./routes/auth'))
app.use('/blogs',require('./routes/blogs'))


//Run server
app.listen('5000',()=>{console.log("listening on port 5000")});
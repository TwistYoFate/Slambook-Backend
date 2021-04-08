require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const https = require('https')
const fs = require('fs')
const path = require('path');
const { Server } = require('http');


// const blogs = require('./db')
// const md5 = require("md5")
// const createPassword = require("./crypt")
const app = express();

//cors permission
app.use(cors());

//Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

const httpsOptions = {
    cert:fs.readFileSync(path.join(__dirname,'ssl','server.crt')),
    key:fs.readFileSync(path.join(__dirname,'ssl','server.key')),
}



mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));


// Home Route
app.get('/',(req,res)=>{
    res.send('Hello');
})



// Additional routes
app.use('/auth',require('./routes/auth'))
app.use('/blogs',require('./routes/blogs'))

//Run server
https.createServer(httpsOptions,app)
.listen('5000',()=>{console.log("listening on port 5000")});
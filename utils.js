// Utility functions for use in the project
const jwt = require('jsonwebtoken')

function CustomResObj(msg=null,isSuccessful=false,payload=null){
    //call this function using new operator
    this.msg=msg;
    this.isSuccessful=isSuccessful;
    this.payload=payload;
    //it will automatically return this
}

//middlewares

async function verifyToken(req,res,next){
    let token = null;
    token = req.headers['authorization'].split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized",isAuthorised:false});
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(401).json({message:"Unauthorized",isAuthorised:false});
        }
        req.authorizedUser=user.username;
    })
    next();
}

module.exports = {
    CustomResObj,
    verifyToken,
}
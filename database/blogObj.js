//This dao user is used to create new user object on will with required data and sent back with res.
// The fields that you dont want to include in the created Object, pass a false value for that parameter

function blogObj(username=false,title=false,author=false,body=false,likes=false,timestamp=Date.now()){
    //call this function using new
    username?this.username = username:null;
    title?this.title = title:null;
    author?this.author = author:null;
    body?this.body = body:null;
    likes?this.likes = likes:null;
    
    this.timestamp = timestamp;
}

module.exports = {
    blogObj
}
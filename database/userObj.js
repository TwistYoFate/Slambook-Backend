//This dao user is used to create new user object on will with required data and sent back with res.
// The fields that you dont want to include in the created Object, pass a false value for that parameter

function userObj(username=false,email=false,firstName=false,lastName=false,password=false){
    //call this function using new
    username?this.username = username:null;
    email?this.email = email:null;
    firstName?this.firstName = firstName:null;
    lastName?this.lastName = lastName:null;
    password?this.password = password:null;
}

module.exports = {
    userObj
}
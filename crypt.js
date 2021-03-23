const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = "aloo"
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

//createpassword
//checkpassword


//create password
function* createPassword(plain_text_password){
    yield bcrypt.hash(plain_text_password, saltRounds).then(hash=>{return hash});
}

//
async function checkUser(username, password) {
    //... fetch user from a db etc.

    const match = await bcrypt.compare(password, user.passwordHash);

    if(match) {
        //login
    }

    //...
}



// sync 

function syncPassHash(plain_text_password){
    return bcrypt.hashSync(plain_text_password, salt);
}

function syncPassVerify(plain_text_password, hashed_password){
    let x = bcrypt.hashSync(plain_text_password,salt)
    // console.log(x + '\n')
    // console.log(hashed_password)
    return (  x==hashed_password );
}



module.exports = crypt = {
    createPassword,
    syncPassHash,
    syncPassVerify,
}
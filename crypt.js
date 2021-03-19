const bcrypt = require('bcrypt');
const saltRounds = 10;
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
    return bcrypt.hashSync(plain_text_password, saltRounds);
}



module.exports = crypt = {
    createPassword,
    syncPassHash
}
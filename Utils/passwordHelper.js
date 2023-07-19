var bcrypt = require('bcryptjs');

function passwordEncryption(plainPassword){
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(plainPassword, salt);
return hash;
}

function passwordValidation(plainPassword,hash)
{
    
   return (bcrypt.compareSync(plainPassword, hash));
}

module.exports = { passwordEncryption, passwordValidation}
const jwt = require('jsonwebtoken');

function create_Token(key)
{
    const token= jwt.sign(key,process.env.SECRET_KEY,{expiresIn:"3h"});
    return token;
}



function verify_Token(token)
{
  return  jwt.verify(token,process.env.SECRET_KEY,function(err,decoded){
        return decoded;
   });
   
}
function generateOtp(){
   return  Math.floor(100000 + Math.random() * 900000);
}
module.exports = {
    create_Token,
    verify_Token,
    generateOtp
}


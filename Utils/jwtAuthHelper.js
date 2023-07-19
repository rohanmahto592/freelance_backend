const jwt = require('jsonwebtoken');

function create_Token(key)
{
    const token= jwt.sign(key,process.env.SECRET_KEY);
    return token;
}



function verify_Token(token)
{
  return  jwt.verify(token,process.env.SECRET_KEY,function(err,decoded){
        return decoded;
   });
   
}

module.exports = {
    create_Token,
    verify_Token
}


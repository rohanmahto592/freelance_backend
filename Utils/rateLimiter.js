const setRateLimit=require("express-rate-limit")

const rateLimiteMiddleWare=setRateLimit({
    windowMs:3*60*1000,
    max:10,
    message:"You have exceed the 10 request,try again after 2 minutes",
    standardHeaders:true,
    legacyHeaders:false

})
module.exports={rateLimiteMiddleWare}

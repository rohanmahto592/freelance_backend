const mongoose = require("mongoose");
const userEmailSchema = new mongoose.Schema({
   email: {
   type:String,
   required:true
  },
  name:{
    type:String,
    required:true
  },
  userType:{
    type:String,
   required:true
  },
});

const userEmail = mongoose.model("userEmail", userEmailSchema);
module.exports = userEmail;

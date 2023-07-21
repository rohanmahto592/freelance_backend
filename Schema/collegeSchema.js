const mongoose = require("mongoose");
const collegeSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Address:{
    type:String,
    required:true
  }
  
});

const College = mongoose.model("college", collegeSchema);
module.exports = College;

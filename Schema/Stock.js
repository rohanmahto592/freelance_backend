const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema({
   itemName: {
   type:String
  },
  quantity:{
    type:String
  },
  university:{
    type:String
  },
  itemRef:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }
});

const stock = mongoose.model("Stock", stockSchema);
module.exports = stock;

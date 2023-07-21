const mongoose = require("mongoose");
const excelHeader = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
});

const ExcelHeader = mongoose.model("excelHeader", excelHeader);
module.exports = ExcelHeader;

const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
  },
  orderStatus: {
    type: String,
    default: "PENDING",
  },
  trackingId: {
    type: String,
  },
  jsonRawData: {
    type: String,
  },
  excelSheetRef: {
    type: String,
    // required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

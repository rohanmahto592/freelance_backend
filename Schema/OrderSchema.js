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
    type: Array,
  },
  jsonRawData: {
    type: String,
  },
  excelSheetRef: {
    type: String,
  },
  orderType: {
    type: String,
    required: true,
  },
}, { timestamps: true});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

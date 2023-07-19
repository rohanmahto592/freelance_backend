const mongoose = require("mongoose");
const deliverySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  excelRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
});

const DeliveryCredentials = mongoose.model("DeliveryCredentials", deliverySchema);
module.exports = DeliveryCredentials;

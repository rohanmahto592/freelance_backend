const mongoose = require("mongoose");
const indianPostServiceSchema = new mongoose.Schema(
  {
    country_name: {
      type: String,
      required: true,
    },
    price:{
        type:String,
        required:true

    },
    shipment_service:{
        type:String,
        default:'indianpost'
    }
  },
  { timestamps: true }
);

const indianPostService = mongoose.model("indianPostService", indianPostServiceSchema);
module.exports = indianPostService;

const mongoose = require("mongoose");
const internationalServiceSchema = new mongoose.Schema(
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
        required:true
    }
  },
  { timestamps: true }
);

const internationalCountryService = mongoose.model("internationalCountryService", internationalServiceSchema);
module.exports = internationalCountryService;

const mongoose = require("mongoose");
const nonServicableCountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const nonServicableCountry = mongoose.model("nonServicableCountry", nonServicableCountrySchema);

module.exports = nonServicableCountry;

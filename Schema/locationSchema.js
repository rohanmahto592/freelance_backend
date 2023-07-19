const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
  }
});

const location = mongoose.model('location', locationSchema);

module.exports = location;

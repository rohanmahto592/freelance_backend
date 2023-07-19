const locationModel = require("../Schema/locationSchema");

async function addLocation(locationData) {
  try {
    const newLocation = new locationModel(locationData);
    const location = await newLocation.save();

    if (location) {
      return { success: true, message: "New location added" };
    }
    return {
      success: false,
      message: "location could not be saved",
    };
  } catch (err) {
    console.log(err.message);
    return { success: false, message: err.message };
  }
}

async function findLocation(city) {
  try{
    const location = await locationModel.findOne({ city });
    if(!location){
      return { success: false, message: "Location Not Found" };
    }
    return { success: true, newAddress: location };
  } catch(err) {
    console.log(err.message);
    return { success: false, message: err.message };
  }
}

module.exports = {findLocation, addLocation};

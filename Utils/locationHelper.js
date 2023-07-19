const axios = require("axios");
const { findLocation, addLocation } = require("../Models/locationModel");

async function findAddress(city, street1, street2) {
  let location = await findLocation(city);
  if (!location.success) {
    location = await findLatAndLong(street1 + " " + street2 + " " + city);
    if (location.success) {
      location.newAddress.city = city;
      await addLocation(location.newAddress);
    }
  }
  return location;
}

async function findLatAndLong(address) {
  // Geocode an address
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const response = await axios.get(url);
  const [lat, long] = response?.data?.features[0]?.center;
  if (!lat && !long) {
    return { success: false };
  }
  const newAddress = await findCompleteAddress(lat, long);
  return { success: true, newAddress };
}

async function findCompleteAddress(lat, long) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${long}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const response = await axios.get(url);

  const newAddress = response.data.features[0].context.reduce(
    (acc, item) => {
      if (item.id.indexOf("postcode") !== -1) {
        acc.postalCode = item.text;
      } else if (item.id.indexOf("country") !== -1) {
        acc.country = item.text;
      } else if (item.id.indexOf("region") !== -1) {
        acc.state = item.text;
      }
      return acc;
    },
    { state: "", country: "", postalCode: "" }
  );

  return newAddress;
}

module.exports = { findCompleteAddress, findLatAndLong, findAddress };

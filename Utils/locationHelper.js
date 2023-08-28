const axios = require("axios");
const { findLocation, addLocation } = require("../Models/locationModel");
const location = require("../Schema/locationSchema");

async function findAddress(country, postalCode, city, street1, street2) {
  let location = await findLocation(city);
  if (!location.success) {
    location = await findLatAndLong(
      street2
        ? street2 + " " + (city ? city : "") + " " + (country ? country : "")
        : street1 + " " + (city ? city : "") + " " + (country ? country : "")
    );
    if (location.success) {
      location.newAddress.city = city;
      await addLocation(location.newAddress);
    }
  }
  return location;
}

async function findLatAndLong(address) {
  // Geocode an address
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const response = await axios.get(url);
    const [lat, long] = response?.data?.features[0]?.center;
    if (!lat && !long) {
      return { success: false };
    }
    const newAddress = await findCompleteAddress(lat, long);
    return { success: true, newAddress };
  } catch (err) {
    return { success: false };
  }
}

async function findCompleteAddress(lat, long) {
  try {
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
  } catch (err) {
    return { state: "", country: "", postalCode: "" };
  }
}
async function findByCityAndCountry(city = "", country = "") {
  const query = `${city},${country}`;
  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_ACCESS_TOKEN,
          types: "place",
          limit: 1,
        },
      }
    );
    const features = response.data.features;
    if (features.length > 0) {
      const city = features[0].text;
      const country = features[0].context.find((context) =>
        context.id.startsWith("country")
      ).text;
      const state = features[0].context.find((context) =>
        context.id.startsWith("region")
      ).text;

      return { success: true, City: city, Country: country, State: state };
    } else {
      return { success: false };
    }
  } catch (Err) {
    return { success: false };
  }
}
async function updateLocationData(city, country, state) {
  let locationData = await location.findOne({ city: city });
  if (locationData) {
    locationData.state = state;
    locationData.country = country;
    locationData.save();
  }
  else
  {
    const response= new location({"city":city,"state":state,"country":country});
    await response.save();
  }
}
module.exports = {
  findCompleteAddress,
  findLatAndLong,
  findAddress,
  findByCityAndCountry,
  updateLocationData,
};

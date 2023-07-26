const { default: axios } = require("axios");
const stringSimilarity = require("string-similarity");
const { findAddress } = require("./locationHelper");
const { createOrder } = require("../Models/orderModel");
const { getMandatoryFields } = require("./getMandatoryFields");
const move_non_sericable = require("./group_non_servicable_shipment");
function calculateFileSize(file) {
  return file.length;
}
function checkMandatoryFields(headerArray, mandatoryFields) {
  const regexFields = mandatoryFields.map(
    (field) => new RegExp(field.toLowerCase(), "i")
  );
  return regexFields.every((regex) =>
    headerArray.some((header) => regex.test(header.toLowerCase()))
  );
}
function mapMandatoryFields(headerArray, mandatoryFields) {
  const resultMap = {};
  mandatoryFields.forEach((mandatoryField) => {
    const regex = new RegExp(mandatoryField, "i");
    const header = headerArray.find((header) => regex.test(header));
    if (header) {
      resultMap[mandatoryField] = header;
    }
  });
  return resultMap;
}
function validateExcel(data, orderType) {
  let mandatoryFields = getMandatoryFields[orderType];
  let headers = Object.keys(data);
  let isValid = checkMandatoryFields(headers, mandatoryFields);
  const headerMap = mapMandatoryFields(headers, mandatoryFields);
  return { isValid, headerMap };
}

function formatPhoneNumber(number) {
  return `${number}`.replace(/[-()\s]/g, "");
}

async function prepareWorkbook(excelJsonData, headerMap, orderType) {
  let invalid = [];
  let non_servicable = [];
  let dispatched = [];
  let duplicates = [];

  await Promise.all(
    excelJsonData.map(async (row) => {
      if (row[headerMap["country code"]]?.toLowerCase() !== "india") {
        non_servicable.push(row);
        return;
      }
      row[headerMap["primary phone number"]] = formatPhoneNumber(
        row[headerMap["primary phone number"]]
      );
      let validNumber = validatePhoneNumber(
        row[headerMap["primary phone number"]]
      );
      let validEmail = validateEmail(row[headerMap["email"]]);
      let validAddress =
        row[headerMap["country code"]].toLowerCase() !== "india"
          ? await validateAddress(
              row[headerMap["country code"]],
              row[headerMap["postal code"]],
              row[headerMap["city"]],
              row[headerMap["street address 1"]],
              row[headerMap["street address 2"]],
              row,
              headerMap
            )
          : { isValid: true };
      if (validEmail && validNumber && validAddress.isValid) {
        const order =
          orderType !== "ADMIT/DEPOSIT"
            ? orderType
            : row[headerMap["admissions status"]].toUpperCase();
        console.log(order);
        const newOrder = await createOrder({
          applicationId: row[headerMap["application: application id"]],
          orderType:
            orderType !== "ADMIT/DEPOSIT"
              ? orderType
              : row[headerMap["admissions status"]].toUpperCase(),
        });
        if (newOrder.success) {
          dispatched.push(row);
          return;
        } else {
          if (newOrder.isDuplicate) {
            duplicates.push(row);
            return;
          }
        }
      }
      invalid.push(row);
      return;
    })
  );
  const response=await move_non_sericable(non_servicable);
  return {
    dispatched: dispatched,
    invalid: invalid,
    non_servicable: response?.non_servicable,
    duplicates,
    ShipRocket_Delivery:response?.ShipRocket_delivery
  };
}

function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return false;
  }
  let regex = /^(\+?91[\-\s]?)?[6-9]\d{9}$/;
  return regex.test(phoneNumber);
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = pattern.test(email);
  return isValid;
}
function minimumDistance(str1, str2) {
  const similarity = stringSimilarity.compareTwoStrings(str1, str2);
  if (similarity >= 0.9) {
    return true;
  } else {
    return false;
  }
}

async function computeAddress(
  country,
  city,
  street1,
  street2,
  address,
  row,
  headerMap
) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const location = await findAddress(country, city, street1, street2);
  let { newAddress, success } = location;
  if (success) {
    row[headerMap["country code"]] = newAddress.country;
    row[headerMap["postal code"]] = newAddress.postalCode;
    row["State"] = newAddress.state;
    address.isValid = true;
    address.state = newAddress.state;
  }
  return address;
}

async function validateAddress(
  country,
  pincode,
  city,
  street1,
  street2,
  row,
  headerMap
) {
  let address = { isValid: false, state: "Z" };
  if (
    !pincode ||
    !/^\d+$/.test(pincode.toString()) ||
    pincode?.toString().length < 6
  ) {
    address = await computeAddress(
      country,
      pincode,
      city,
      street1,
      street2,
      address,
      row,
      headerMap
    );
    return address;
  }
  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    pincode = pincode.toString().replace(/\s/g, "");
    pincode = parseFloat(pincode);
    let data = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    data = data.data[0];
    if (!data["PostOffice"]) {
      address = await computeAddress(
        country,
        pincode,
        city,
        street1,
        street2,
        address,
        row,
        headerMap
      );

      return address;
    }

    for (let i = 0; i < data["PostOffice"].length; i++) {
      let cityName =
        data.PostOffice[i]["Name"] +
        " " +
        data.PostOffice[i]["District"] +
        " " +
        data.PostOffice[i]["Division"] +
        " " +
        data.PostOffice[i]["Region"] +
        " " +
        data.PostOffice[i]["Block"];
      cityName = cityName.toLowerCase().split(" ");
      if (cityName.indexOf(city.toLowerCase()) !== -1) {
        address.isValid = true;
        address.state = data.PostOffice[i]["State"];
        return address;
      } else if (
        minimumDistance(
          data.PostOffice[i]["Name"].toLowerCase(),
          city.toLowerCase()
        )
      ) {
        row[headerMap["city"]] = data.PostOffice[i]["Name"];
        address.isValid = true;
        address.state = data.PostOffice[i]["State"];
        return address;
      }
    }
    address = await computeAddress(
      country,
      pincode,
      city,
      street1,
      street2,
      address,
      row,
      headerMap
    );
    if (!address.isValid) {
      row[headerMap["city"]] = data.PostOffice[0]["Name"];
      address.isValid = true;
      address.state = data.PostOffice[0]["State"];
    }
    return address;
  } catch (err) {
    return address;
  }
}

module.exports = {
  validateExcel,
  prepareWorkbook,
  validatePhoneNumber,
  validateAddress,
  validateEmail,
  calculateFileSize,
};

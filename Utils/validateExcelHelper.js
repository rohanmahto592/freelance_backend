const { default: axios } = require("axios");
const stringSimilarity = require("string-similarity");
const {
  findAddress,
  findByCityAndCountry,
  updateLocationData,
} = require("./locationHelper");
const { createOrder } = require("../Models/orderModel");
const { getMandatoryFields } = require("./getMandatoryFields");
const {
  move_non_servicable,
  validatePhoneNumber,
} = require("./group_non_servicable_shipment");
const { default: mongoose } = require("mongoose");
const nonServicableCountry = require("../Schema/nonServicableCountires");
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
async function validateExcel(data, orderType) {
  let mandatoryFields = await getMandatoryFields(orderType);
  mandatoryFields = mandatoryFields.map((headers) => headers.name);
  let headers = Object.keys(data);
  let isValid = checkMandatoryFields(headers, mandatoryFields);
  const headerMap = mapMandatoryFields(headers, mandatoryFields);
  return { isValid, headerMap };
}

function formatPhoneNumber(number) {
  return `${number}`.replace(/[-()\s]/g, "");
}
async function getNonServicableCountryList(){
  const response=await nonServicableCountry.find({});
  return response;
}

async function prepareWorkbook(
  excelJsonData,
  headerMap,
  orderType,
  university
) {
  let invalid = [];
  let non_servicable = [];
  let dispatched = [];
  let duplicates = [];
  const countryList=await getNonServicableCountryList();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Promise.all(
      excelJsonData.map(async (row) => {
        let validEmail, validateResponse, checkValidAddress;
        row["awb no"] = "";
        row["country courier code"] = "";
         const isInValidCountry=checkNonServicableCountry( row[headerMap["country"]],countryList)
          if(isInValidCountry)
          {
            row["error status"] ="country comes under the non servicable group.";
            invalid.push(row);
            return;
          }
       else if (orderType === "ADMIT/DEPOSIT") {
          if (row[headerMap["country"]]?.toLowerCase() !== "india") {
            let address = { isValid: false, state: "Z" };
            address = await findAddressHepler(
              row[headerMap["country"]],
              row[headerMap["postal code"]],
              row[headerMap["city"]],
              row[headerMap["street address 1"]],
              row[headerMap["street address 2"]],
              row,
              headerMap,
              address
            );
            non_servicable.push(row);
            return;
          }
          row[headerMap["phone number"]] = formatPhoneNumber(
            row[headerMap["phone number"]]
          );

          validateResponse = await validatePhoneNumber(
            row[headerMap["phone number"]],
            row[headerMap["country"]]
          );

          validEmail = validateEmail(row[headerMap["email"]]);

          checkValidAddress = await validateAddress(
            row[headerMap["country"]],
            row[headerMap["postal code"]],
            row[headerMap["city"]],
            row[headerMap["street address 1"]],
            row[headerMap["street address 2"]],
            row,
            headerMap
          );

          row["state"] = checkValidAddress.state;
        } else if (orderType === "DPM") {
          validEmail = validateEmail(row[headerMap["email"]]);
        }

        if (
          orderType === "FARE" ||
          (orderType === "DPM" && validEmail) ||
          (validEmail && validateResponse.success && checkValidAddress.isValid)
        ) {
          const order =
            orderType !== "ADMIT/DEPOSIT"
              ? orderType
              : row[headerMap["admissions status"]].toUpperCase();
          const newOrder = await createOrder({
            applicationId:
              orderType === "FARE"
                ? row["application id"]
                : orderType === "DPM"
                ? `App ID-${Date.now()}-${row["STUDENT_ID"]}`
                : row[headerMap["application id"]],
            orderType: order,
          });
          if (newOrder.success) {
            if (orderType === "DPM") {
              row["university"] = university;
            }
            dispatched.push(row);
            return;
          } else {
            if (newOrder.isDuplicate) {
              duplicates.push(row);
              return;
            }
          }
        }
        row["error status"] = validateResponse?.message;
        invalid.push(row);
        return;
      })
    );
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
  const response = await move_non_servicable(
    non_servicable,
    headerMap,
    invalid
  );

  const deliveryMapping = await createOrderInternational(
    response,
    headerMap,
    orderType,
    duplicates
  );
  return {
    dispatched: dispatched,
    invalid: invalid,
    non_servicable: response?.non_servicable,
    duplicates,
    ShipRocket_Delivery: deliveryMapping?.ShipRocket_Delivery,
    IndianPost_Delivery: deliveryMapping?.IndianPost_Delivery,
  };
}
function checkNonServicableCountry(country,countryList){
  let isInValid=false;
  for(let index=0;index<countryList.length;index++)
  {
    if(countryList[index].name.toLowerCase().trim()===country.toLowerCase().trim())
    {
      isInValid=true;
      break;
    }
  }
  return isInValid;

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
async function findAddressHepler(
  country,
  pincode,
  city,
  street1,
  street2,
  row,
  headerMap,
  address
) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const location = await findAddress(country, pincode, city, street1, street2);
  let { newAddress, success } = location;
  if (
    success &&
    newAddress?.country?.toLowerCase() === country?.toLowerCase()
  ) {
    row[headerMap["country"]] = newAddress.country;
    row[headerMap["postal code"]] = newAddress?.postalCode
      ? newAddress.postalCode
      : pincode;
    row["state"] = newAddress.state;
    address.isValid = true;
    address.state = newAddress.state;
  } else {
    if (city || country) {
      const response = await findByCityAndCountry(city, country);
      if (response.success) {
        await updateLocationData(
          response.City,
          response.Country,
          response.State
        );
        row[headerMap["country"]] = response.Country;
        row["state"] = response.State;
        address.isValid = true;
        address.state = response.State;
      }
    }
  }
  return address;
}
async function computeAddress(
  country,
  pincode,
  city,
  street1,
  street2,
  address,
  row,
  headerMap
) {
  return await findAddressHepler(
    country,
    pincode,
    city,
    street1,
    street2,
    row,
    headerMap,
    address
  );
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
    pincode = pincode?.toString().replace(/\s/g, "");
    pincode = parseFloat(pincode);
    let data = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    data = data?.data[0];
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

    for (const postOffice of data?.PostOffice) {
      const cityName =
        `${postOffice.Name} ${postOffice.District} ${postOffice.Division} ${postOffice.Region} ${postOffice.Block}`.toLowerCase();
      if (cityName.includes(city.toLowerCase())) {
        address.isValid = true;
        address.state = postOffice.State;
        return address;
      } else if (
        minimumDistance(postOffice?.Name?.toLowerCase(), city?.toLowerCase())
      ) {
        row[headerMap.city] = postOffice.Name;
        address.isValid = true;
        address.state = postOffice.State;
        return address;
      } else {
        if (city && pincode) {
          (address.isValid = true), (address.state = postOffice.State);
          return address;
        }
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
async function createOrderInternational(
  internationalExcelData,
  headerMap,
  order,
  duplicates
) {
  const { ShipRocket_delivery, IndianPost_delivery } = internationalExcelData;
  const internationalDelivery = {
    ShipRocket_Delivery: [],
    IndianPost_Delivery: [],
  };
  const ShipRocket_Delivery = Promise.all(
    ShipRocket_delivery?.map(async (row) => {
      const newOrder = await createOrder({
        applicationId: row[headerMap["application id"]],
        orderType: order,
      });

      if (newOrder.success) {
        return row;
      } else {
        if (newOrder.isDuplicate) {
          duplicates.push(row);
        }
      }
    })
  );

  const IndianPost_Delivery = Promise.all(
    IndianPost_delivery?.map(async (row) => {
      const newOrder = await createOrder({
        applicationId: row[headerMap["application id"]],
        orderType: order,
      });
      if (newOrder.success) {
        return row;
      } else {
        if (newOrder.isDuplicate) {
          duplicates.push(row);
        }
      }
    })
  );
  await Promise.all([ShipRocket_Delivery, IndianPost_Delivery]).then(
    ([shipRocketResult, indianPostResult]) => {
      shipRocketResult = shipRocketResult.filter((item) => item !== undefined);
      indianPostResult = indianPostResult.filter((item) => item !== undefined);
      internationalDelivery.ShipRocket_Delivery = shipRocketResult;
      internationalDelivery.IndianPost_Delivery = indianPostResult;
    }
  );
  return internationalDelivery;
}

module.exports = {
  validateExcel,
  prepareWorkbook,
  validatePhoneNumber,
  validateAddress,
  validateEmail,
  calculateFileSize,
};

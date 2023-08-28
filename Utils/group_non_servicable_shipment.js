const { default: axios } = require("axios");
const country_alph2_Code = require("./alpha2_code_country");
const internationalCountryService = require("../Schema/InternationalCountryService");
const indianPostService = require("../Schema/indianPostSchema");
const {PhoneNumberUtil}=require("google-libphonenumber");
const { callingCodes } = require("./callingCodes");
const { findByCityAndCountry } = require("./locationHelper");

function validatePhoneNumber(phoneNumber, Country) {
  return new Promise((resolve) => {
   
    let code;
    let value;
    if (!phoneNumber) {
      resolve({success:false,message:"Phone number is missing"});
    }
    phoneNumber=phoneNumber?.toString().replace(/\D/g, "");
    if (phoneNumber?.toString()=="#ERROR!") {
      resolve({success:false,message:"Phone number is not valid"});
    }
    callingCodes.forEach((country) => {
      if (country?.country?.toLowerCase().trim() === Country?.toLowerCase().trim()) {
        code = country.code;
        value=country.value;
      }
    });
    try {
      if(code)
      {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const isValid=phoneUtil.isValidNumberForRegion(phoneUtil.parse(phoneNumber, code), code);
      resolve(isValid?{success:true}:{success:false,message:'Invalid phone number'});
      }
      else
      {
        resolve({success:false,message:"No such mapping found for a given country. Check for correct country name"})
      }
    } catch (error) {
     
      resolve({success:false,message:error});
    }
  });
}
async function checkIfCountryExsistsInDB(
  getInternationalServiceDetails,
  countryName
) {
  const response = {
    isTrue: false,
    consignment_amount: 0,
    shipment_service: "",
  };
  getInternationalServiceDetails?.map((item) => {
    if (item.country_name?.toLowerCase() == countryName?.toLowerCase()) {
      response.isTrue = true;
      response.consignment_amount = item.amount;
      response.shipment_service = item.shipment_service;
    }
  });
  return response;
}

async function move_non_servicable(non_servicable,headerMap,invalid) {
  const getInternationalServiceDetails =
    await internationalCountryService.find();
  const IndianPostCountriesPrice = await indianPostService.find();

  return new Promise(async (resolve, reject) => {
    let ShipRocket_delivery = [];
    let IndianPost_delivery = [];
    for (let i = 0; i < non_servicable.length; i++) {
      let item = non_servicable[i];
      let response1=await findByCityAndCountry(item[headerMap["city"]],item[headerMap["country"]]);
      if(response1.success)
      {
        item[headerMap["city"]]=response1.City;
        item[headerMap["country"]]=response1.Country;
      }
      let response2= await validatePhoneNumber(item[headerMap["phone number"]],item[headerMap["country"]]);
      if(response2.success)
      {
      
      const { isTrue, consignment_amount, shipment_service } =
        await checkIfCountryExsistsInDB(
          getInternationalServiceDetails,
          item[headerMap["country"]]
        );
      if (isTrue) {
        if (shipment_service == "shiprocket") {
          ShipRocket_delivery.push(item);
        } else {
          IndianPost_delivery.push(item);
        }
        non_servicable.splice(i, 1);
        i--;
      } else {
        let country_info = country_alph2_Code.find(
          (country) =>
            country?.Name?.toLowerCase() ==  item[headerMap["country"]]?.toLowerCase()
        );
        let shipRocketAmount = parseInt(
          await shipRocket_consignment_price_calculator(country_info?.Code)
        );

        let indianPostAmount = parseInt(
          await indianPost_consignment_price(
            country_info?.Name,
            IndianPostCountriesPrice
          )
        );
        if (indianPostAmount) {
          if (shipRocketAmount <= 2100 && indianPostAmount <= 2100) {
            if (shipRocketAmount >= indianPostAmount) {
              IndianPost_delivery.push(item);
            
                await internationalCountryService.findOneAndUpdate(
                  { country_name:  item[headerMap["country"]] },
                  {
                    country_name:  item[headerMap["country"]],
                    price: indianPostAmount,
                    shipment_service: "indianpost",
                  },
                  { upsert: true, new: true }
                );
            } else {
              ShipRocket_delivery.push(item);
                await internationalCountryService.findOneAndUpdate(
                  { country_name: item[headerMap["country"]] },
                  {
                    country_name:  item[headerMap["country"]],
                    price: shipRocketAmount,
                    shipment_service: "shiprocket",
                  },
                  { upsert: true, new: true }
                );
            }
          }
        } else {
          ShipRocket_delivery.push(item);
          await internationalCountryService.findOneAndUpdate(
            { country_name:  item[headerMap["country"]] },
            {
              country_name:  item[headerMap["country"]],
              price: shipRocketAmount,
              shipment_service: "shiprocket",
            },
            { upsert: true, new: true }
          );
        }
        non_servicable.splice(i, 1);
        i--;
      }
    }
    else
    {
      item["error status"]=response2.message;
      invalid.push(item);
      non_servicable.splice(i, 1);
     i--;
    }
    }
    resolve({
      non_servicable: non_servicable,
      ShipRocket_delivery: ShipRocket_delivery,
      IndianPost_delivery: IndianPost_delivery,
    });
  });
}

async function indianPost_consignment_price(
  countryName,
  IndianPostCountriesPrice
) {
  return new Promise((resolve, reject) => {
    IndianPostCountriesPrice.forEach((country) => {
      if (country?.country_name?.toLowerCase() === countryName?.toLowerCase()) {
        resolve(country.price);
      }
    });
    resolve(null);
  });
}
async function shipRocket_consignment_price_calculator(country_code) {
  const weight = 0.7;
  const cod = 0;
  const pickup_postcode = 246701;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  try {
    let config = {
      url: `https://apiv2.shiprocket.in/v1/external/courier/international/serviceability`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SHIPROCKET_ACCESS_TOKEN}`,
      },
      params: {
        weight: weight,
        cod: cod,
        delivery_country: country_code?.toString(),
        pickup_postcode: pickup_postcode,
      },
    };

    const response = await axios(config);
    return response?.data?.data["available_courier_companies"][0]["rate"][
      "rate"
    ];
  } catch (error) {
    console.log(error);
  }
}
module.exports = move_non_servicable;

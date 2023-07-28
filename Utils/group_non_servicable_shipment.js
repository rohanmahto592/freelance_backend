const { default: axios } = require("axios");
const country_alph2_Code = require("./alpha2_code_country");
const internationalCountryService = require("../Schema/InternationalCountryService");

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
    if (item.country_name?.toLowerCase() == countryName.toLowerCase()) {
      response.isTrue = true;
      response.consignment_amount = item.amount;
      response.shipment_service = item.shipment_service;
    }
  });
  return response;
}
async function move_non_sericable(non_servicable) {
  const getInternationalServiceDetails =
    await internationalCountryService.find();

  return new Promise(async (resolve, reject) => {
    let ShipRocket_delivery = [];
    let IndianPost_delivery = [];
    for (let i = 0; i < non_servicable.length; i++) {
      const item = non_servicable[i];
      const { isTrue, consignment_amount, shipment_service } =
        await checkIfCountryExsistsInDB(
          getInternationalServiceDetails,
          item["Country Code"]
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
            country.Name.toLowerCase() == item["Country Code"].toLowerCase()
        );
        let shipRocetAmount = parseInt(
          await shipRocket_consignment_price_calculator(
            country_info?.Code,
          )
        );
        let indianPostAmount = 1900;
        if (shipRocetAmount <= 2100 && indianPostAmount <= 2100) {
          if (shipRocetAmount >= indianPostAmount) {
            IndianPost_delivery.push(item);
            const response = new internationalCountryService({
              country_name: item["Country Code"],
              price: indianPostAmount,
              shipment_service: "indianpost",
            });
            response.save();
          } else {
            ShipRocket_delivery.push(item);
            const response = new internationalCountryService({
              country_name: item["Country Code"],
              price: shipRocetAmount,
              shipment_service: "shiprocket",
            });
            response.save();
          }
          non_servicable.splice(i, 1);
          i--;
        }
      }
    }
    //console.log(ShipRocket_delivery);
    resolve({
      non_servicable: non_servicable,
      ShipRocket_delivery: ShipRocket_delivery,
      IndianPost_delivery:IndianPost_delivery
    });
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
module.exports = move_non_sericable;

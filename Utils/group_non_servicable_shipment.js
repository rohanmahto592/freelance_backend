const { default: axios } = require("axios");
const country_alph2_Code = require("./alpha2_code_country");
async function move_non_sericable(non_servicable){
    return new Promise(async (resolve, reject) => {
        let ShipRocket_delivery = [];
        for (let i = 0; i < non_servicable.length; i++) {
          const item = non_servicable[i];
          let country_info = country_alph2_Code.find(
            (country) => country.Name.toLowerCase() == item['Country Code'].toLowerCase()
          );
          if (country_info) {
            let amount = await shipRocket_consignment_price_calculator(country_info.Code);
            if (amount <= 2100) {
              ShipRocket_delivery.push(item);
              non_servicable.splice(i, 1); // remove the current item from non_servicable
              i--; // decrement i to account for the removed item
            }
          }
        }
        //console.log(ShipRocket_delivery);
        resolve({ non_servicable: non_servicable, ShipRocket_delivery: ShipRocket_delivery });
      });
      
}

async function shipRocket_consignment_price_calculator(country_code){
    const weight=0.7;
    const cod=0;
    const pickup_postcode=246701;
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    try {
        let config = {
          url: `https://apiv2.shiprocket.in/v1/external/courier/international/serviceability`,
          method: 'get',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${process.env.SHIPROCKET_ACCESS_TOKEN}`
          },
          params: {
            weight: weight,
            cod: cod,
            delivery_country: country_code.toString(),
            pickup_postcode: pickup_postcode
          },
        };
    
        const response = await axios(config);
        return (response?.data?.data["available_courier_companies"][0]["rate"]["rate"]);
      } catch (error) {
        console.log(error);
      }
}
module.exports=move_non_sericable
const axios = require("axios");

async function trackSRC(trackingIds) {
  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const data = await axios({
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/courier/track/awbs",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SHIPROCKET_ACCESS_TOKEN}`,
      },
      data: JSON.stringify({
        awbs: trackingIds,
      }),
    });
    if(data.data?.tracking_data?.error) {
      console.log(data.data);
      return { success: false };
    }
    return { success: true, data };
  } catch (e) {
    console.log("Error occured ", e.message);
    return { success: false };
  }
}

async function trackSMC() {}

async function trackIPC() {}

module.exports = { trackSRC };

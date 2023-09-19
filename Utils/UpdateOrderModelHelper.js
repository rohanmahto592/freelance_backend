const Order = require("../Schema/OrderSchema");
const { trackSRC } = require("./trackingApi");

async function UpdateOrderModelHelper(Data) {
  try {
    Data?.forEach((student) => {
      Order.findOneAndUpdate(
        { applicationId: student["application id"] },
        {
          applicationId: student.applicationId,
          jsonRawData: JSON.stringify(student.jsonData),
          excelSheetRef: student.excelSheetRef,
          trackingId: student.trackingId,
          courierCode: student.courierCode,
        },
        {
          new: true,
        }
      ).then((response) => {});
    });
    return {
      success: true,
      message:
        "DeliverySheet Processed Successfully,You may now close the window.",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Failed to process the Excelsheet",
    };
  }
}

async function UpdateOrderStatus() {
  const OrderData = await Order.find({ trackingId: { $exists: true } }).select(
    "trackingId courierCode"
  );
  let batches = { SMC: [], IPC: [], SRC: [] },
    currentSRC = [],
    SRCcount = 0;

  OrderData.map(({ trackingId, courierCode }) => {
    switch (courierCode) {
      case "SMC":
        if (trackingId !== "") {
          batches[courierCode].push(trackingId.trim());
        }
        break;
      case "IPC":
        if (trackingId !== "") {
          batches[courierCode].push(trackingId.trim());
        }
        break;
      case "SRC":
        if (SRCcount === 50) {
          SRCcount = 0;
          batches[courierCode].push(currentSRC);
          currentSRC = [];
        } else if (trackingId !== "") {
          const trackingIds = trackingId.trim().split(",");
          SRCcount += trackingIds.length;
          if (SRCcount > 50) {
            SRCcount = trackingIds.length;
            batches[courierCode].push(currentSRC);
            currentSRC = [];
          }
          currentSRC.push(trackingId.trim());
        }
        break;
    }
  });

  if (SRCcount > 0) {
    batches["SRC"].push(currentSRC);
  }

  batches["SRC"].map((batch) => {
    trackSRC(batch).then((trackingData) => {
      if (trackingData.success) {
        batch.map((id) => {
          const status =
            trackingData[id]["tracking_data"]["shipment_track"][0][
              "current_status"
            ] || "PENDING";
          Order.findOneAndUpdate(
            { trackingId: id },
            {
              orderStatus: status,
            }
          ).then((response) => {});
        });
      }
    });
  });
}

module.exports = { UpdateOrderModelHelper, UpdateOrderStatus };

const Order = require("../Schema/OrderSchema");

function UpdateOrderModelHelper(Data) {
  for (student in Data) {
    if (student.trackingId) {
      Order.findOneAndUpdate(
        { applicationId: student["application id"] },
        {
          applicationId: student.applicationId,
          jsonRawData: JSON.stringify(student.jsonData),
          excelSheetRef: student.excelSheetRef,
          trackingId: student.trackingId,
        },
        {
          new: true,
        }
      ).then((response) => {});
    }
  }
  return {
    success: true,
    message:
      "DeliverySheet Processed Successfully,You may now close the window.",
  };
}
module.exports = { UpdateOrderModelHelper };

const Order = require("../Schema/OrderSchema");

async function UpdateOrderModelHelper(Data) {
    try{
  Data?.forEach(student => {
    
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

  });
  return {
    success: true,
    message:
      "DeliverySheet Processed Successfully,You may now close the window.",
  };
      
}catch(err)
{
    console.log(err)
    return {
        success: false,
        message:
          "Failed to process the Excelsheet",
      };
}
}
module.exports = { UpdateOrderModelHelper };

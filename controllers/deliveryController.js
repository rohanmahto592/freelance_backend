const { getUserDeliveryExcelRefById } = require("../Models/orderModel");
const xlsx = require("xlsx");
const { UpdateExcelSheet } = require("../Utils/UpdateExcelSheetOrderHelper");
const uploadDeliveryExcelSheet = (req, res) => {
  const excelSheetBufferData = req.file.buffer;
  const userId = req.body.userDeliveryId;
  getUserDeliveryExcelRefById(userId).then((getExcelSheetRef) => {
    if (!getExcelSheetRef.success) {
      res.send({
        success: false,
        message: "No excelSheet is found for this deliverySheet",
      });
    } else {
      const workbook = xlsx.read(excelSheetBufferData, { type: "buffer" });
      UpdateExcelSheet(workbook, getExcelSheetRef.message)
        .then((response) => {
          if (response.length > 0) {
            res.send(response[0]);
          } else {
            res.send({
              success: false,
              message: "Internal server error, try again after some time.",
            });
          }
        })
        .catch((error) => {
          res.send({
            success: false,
            message: "Internal server error, try again after some time.",
          });
        });
    }
  });
};
module.exports = { uploadDeliveryExcelSheet };

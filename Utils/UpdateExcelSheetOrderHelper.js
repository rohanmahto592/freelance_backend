const XLSX = require("xlsx");
const { UpdateOrderModelHelper } = require("./UpdateOrderModelHelper");
function trimSheetJson(jsonData) {
  const trimmedDataArray = jsonData.map((obj) => {
    const trimmedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const trimmedKey = key.trim();
        trimmedObj[trimmedKey] = obj[key];
      }
    }
    return trimmedObj;
  });
  return trimmedDataArray;
}
function UpdateExcelSheet(workbook, excelSheetRef) {
  let workbook_sheetNames = workbook.SheetNames;
  return new Promise((resolve, reject) => {
    const promises = workbook_sheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      let trimSheet = trimSheetJson(XLSX.utils.sheet_to_json(worksheet));
      if (
        sheetName === "Dispatched" ||
        sheetName === "ShipRocket_Delivery" ||
        sheetName === "IndianPost_Delivery"
      ) {
        const AWB_NO_Data = trimSheet?.map((item) => ({
          trackingId: item["awb no"],
          "application id": item["application id"],
          jsonData: item,
          excelSheetRef: excelSheetRef,
          courierCode: item["country courier code"],
        }));
        if (AWB_NO_Data?.length > 0) {
          return UpdateOrderModelHelper(AWB_NO_Data);
        }
      }
    });

    Promise.all(promises)
      .then((response) => {
        resolve(response.filter((response) => response !== undefined));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = { UpdateExcelSheet };

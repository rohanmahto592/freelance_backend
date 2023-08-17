const XLSX = require("xlsx");
const { UpdateOrderModelHelper } = require("./UpdateOrderModelHelper");
function trimSheetJson(jsonData){
    const trimmedDataArray = jsonData.map(obj => {
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
      let trimSheet=trimSheetJson(XLSX.utils.sheet_to_json(worksheet));
      let AWB_NO_Data;
      switch (sheetName) {
        case "Dispatched":
          AWB_NO_Data = trimSheet?.map((item) =>({
           
            trackingId: item["AWB NO"],
            "application id": item["application id"],
            jsonData: item,
            excelSheetRef: excelSheetRef,
          }));
          break;

        case "ShipRocket_Delivery":
          AWB_NO_Data = trimSheet?.map((item) => ({
            trackingId: item["AWB NO"],
            "application id": item["application id"],
            jsonData: item,
            excelSheetRef: excelSheetRef,
          }));
          break;

        case "IndianPost_Delivery":
          AWB_NO_Data = trimSheet?.map((item) => ({
            trackingId: item["AWB NO"],
            "application id": item["application id"],
            jsonData: item,
            excelSheetRef: excelSheetRef,
          }));
          break;
      }
      if (AWB_NO_Data?.length > 0) {
        return UpdateOrderModelHelper(AWB_NO_Data);
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


const XLSX = require("xlsx");
 function Json_ExcelFile(JsonData) {
  const dispatched = JsonData.dispatched;
  const invalid = JsonData?.invalid;
  const non_servicable = JsonData?.non_servicable;
  const ShipRocket_delivery=JsonData?.ShipRocket_Delivery;
  const IndianPost_delivery=JsonData?.IndianPost_Delivery;
  const duplicates = JsonData?.duplicates;
  const sheet1 = XLSX.utils.json_to_sheet(dispatched);
  const sheet2 = XLSX.utils.json_to_sheet(invalid);
  const sheet3 = XLSX.utils.json_to_sheet(non_servicable);
  const sheet4 = XLSX.utils.json_to_sheet(duplicates);
  const sheet5=XLSX.utils.json_to_sheet(ShipRocket_delivery);
  const sheet6=XLSX.utils.json_to_sheet(IndianPost_delivery);
  const workbook = XLSX.utils.book_new();
  // Add the worksheets to the workbook
  XLSX.utils.book_append_sheet(workbook, sheet1, "Dispatched");
  XLSX.utils.book_append_sheet(workbook, sheet2, "Invalid");
  XLSX.utils.book_append_sheet(workbook, sheet3, "Non_Servicable");
  XLSX.utils.book_append_sheet(workbook, sheet4, "Duplicates");
  XLSX.utils.book_append_sheet(workbook, sheet5, "ShipRocket_Delivery");
  XLSX.utils.book_append_sheet(workbook, sheet6, "IndianPost_Delivery");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return workbook;
}
module.exports = { Json_ExcelFile };

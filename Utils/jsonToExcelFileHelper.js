const XLSX = require("xlsx");
const rearrangeObjectKeysAlphabetically = require("./rearrangeExcelAlphabeticalOrder");
async function Json_ExcelFile(JsonData) {
  let {dispatched,invalid,non_servicable,ShipRocket_Delivery,IndianPost_Delivery,duplicates}=JsonData;
  dispatched=dispatched.map(obj => rearrangeObjectKeysAlphabetically(obj));
  invalid=invalid?.map(obj => rearrangeObjectKeysAlphabetically(obj));
  non_servicable=non_servicable?.map(obj => rearrangeObjectKeysAlphabetically(obj));
  duplicates=duplicates?.map(obj => rearrangeObjectKeysAlphabetically(obj));
 ShipRocket_Delivery= ShipRocket_Delivery?.map(obj => rearrangeObjectKeysAlphabetically(obj));
 IndianPost_Delivery= IndianPost_Delivery?.map(obj => rearrangeObjectKeysAlphabetically(obj));
  const sheet1 = XLSX.utils.json_to_sheet(dispatched);
  const sheet2 = XLSX.utils.json_to_sheet(invalid);
  const sheet3 = XLSX.utils.json_to_sheet(non_servicable);
  const sheet4 = XLSX.utils.json_to_sheet(duplicates);
  const sheet5 = XLSX.utils.json_to_sheet(ShipRocket_Delivery);
  const sheet6 = XLSX.utils.json_to_sheet(IndianPost_Delivery);
  const workbook = XLSX.utils.book_new();
  // Add the worksheets to the workbook
  XLSX.utils.book_append_sheet(workbook, sheet1, "Dispatched");
  XLSX.utils.book_append_sheet(workbook, sheet2, "Invalid");
  XLSX.utils.book_append_sheet(workbook, sheet3, "Non_Servicable");
  XLSX.utils.book_append_sheet(workbook, sheet4, "Duplicates");
  XLSX.utils.book_append_sheet(workbook, sheet5, "ShipRocket_Delivery");
  XLSX.utils.book_append_sheet(workbook, sheet6, "IndianPost_Delivery");
  return workbook;
}
module.exports = { Json_ExcelFile };

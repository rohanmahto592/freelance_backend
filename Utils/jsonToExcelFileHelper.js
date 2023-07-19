const XLSX = require("xlsx");
function Json_ExcelFile(JsonData) {
  const dispatched = JsonData.dispatched;
  const invalid = JsonData.invalid;
  const non_servicable = JsonData.non_servicable;
  const duplicates = JsonData.duplicates;
  const workbook = XLSX.utils.book_new();

  const sheet1 = XLSX.utils.json_to_sheet(dispatched);
  const sheet2 = XLSX.utils.json_to_sheet(invalid);
  const sheet3 = XLSX.utils.json_to_sheet(non_servicable);
  const sheet4 = XLSX.utils.json_to_sheet(duplicates);

  // Add the worksheets to the workbook
  XLSX.utils.book_append_sheet(workbook, sheet1, "Dispatched");
  XLSX.utils.book_append_sheet(workbook, sheet2, "Invalid");
  XLSX.utils.book_append_sheet(workbook, sheet3, "Non_Servicable");
  XLSX.utils.book_append_sheet(workbook, sheet4, "Duplicates");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return workbook;
}
module.exports = { Json_ExcelFile };

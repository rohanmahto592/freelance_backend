const file = require("../Schema/fileSchema");

async function storeFile(
  intialFileJosn,
  processedFileJson,
  userId,
  initialFileSize,
  name,
  docFile,
  body
) {
  const jsonString = JSON.stringify(processedFileJson);
  console.log(processedFileJson);
  const buffer = Buffer.from(jsonString, "utf8");
  initialFileSize = (initialFileSize / (1024 * 1024)).toPrecision(4) + " MB";
  let processedFileSize =
    (buffer.length / (1024 * 1024)).toPrecision(4) + " MB";
  let intialExcelFileCount = intialFileJosn.length;
  let processedExcelFileDispatchedCount = processedFileJson.dispatched.length;
  const orderType = body.orderType;
  const fileData = {
    initialExcelFile: JSON.stringify(intialFileJosn),
    processedExcelFile: JSON.stringify(processedFileJson),
    userRef: userId,
    name,
    initialFileSize,
    processedFileSize,
    intialExcelFileCount,
    processedExcelFileDispatchedCount,
    docFile,
    orderType,
  };
  if (body.university) {
    fileData.university = body.university;
  }

  const newFile = new file(fileData);
  const info = await newFile.save();
  return info;
}

module.exports = { storeFile };

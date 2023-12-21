const file = require("../Schema/fileSchema");

async function updateFileData(
  intialFileJosn,
  processedFileJson,
  userId,
  initialFileSize,
  name,
  docFile,
  body,
  id
) {
  const jsonString = JSON.stringify(processedFileJson);
  const buffer = Buffer.from(jsonString, "utf8");
  initialFileSize = (initialFileSize / (1024 * 1024)).toPrecision(4) + " MB";
  let processedFileSize =
    (buffer.length / (1024 * 1024)).toPrecision(4) + " MB";
  let intialExcelFileCount = intialFileJosn.length;
  let processedExcelFileDispatchedCount = processedFileJson.dispatched.length;
  let processedExcelFileShipRocketDeliveryCount =
    processedFileJson.ShipRocket_Delivery.length;
  let processedExcelFileIndianPostDeliveryCount =
    processedFileJson.IndianPost_Delivery.length;
  const orderType = body.orderType;
  const fileData = {
    initialExcelFile: Buffer.from(JSON.stringify(intialFileJosn), "utf-8"),
    processedExcelFile: Buffer.from(JSON.stringify(processedFileJson), "utf-8"),
    userRef: userId,
    name,
    initialFileSize,
    processedFileSize,
    intialExcelFileCount,
    processedExcelFileDispatchedCount,
    docFile,
    orderType,
    processedExcelFileIndianPostDeliveryCount,
    processedExcelFileShipRocketDeliveryCount,
    isDocPresent: docFile ? true : false,
  };
  if (body.university) {
    fileData.university = body.university;
  }

  await file.updateOne(
    { _id: id },
    { $set: { ...fileData, isProcessed: true } }
  );
}

async function createFileTemplate() {
  const newFile = new file();
  const info = await newFile.save();
  return info;
}

async function getFileStatus(id) {
  const fileData = await file.findById(id);
  if (fileData.isProcessed) {
    return true;
  }
  return false;
}

async function deleteUnProcessedFile(id) {
  await file.deleteOne({ _id: id, isProcessed: false });
}

module.exports = {
  updateFileData,
  getFileStatus,
  createFileTemplate,
  deleteUnProcessedFile,
};

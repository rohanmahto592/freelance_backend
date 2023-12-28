const { default: axios } = require("axios");
const file = require("../Schema/fileSchema");
const { putObjectUrl } = require("../Utils/awsS3Util");
const { Chance } = require("chance");
const { compress } = require("compress-json");
const chance = new Chance();

async function updateFileData(
  excelFileName,
  initialFileJson,
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
  let intialExcelFileCount = initialFileJson.length;
  let processedExcelFileDispatchedCount = processedFileJson.dispatched.length;
  let processedExcelFileShipRocketDeliveryCount =
    processedFileJson.ShipRocket_Delivery.length;
  let processedExcelFileIndianPostDeliveryCount =
    processedFileJson.IndianPost_Delivery.length;
  const orderType = body.orderType;
  const date = Date.now();
  chance;
  const initialExcelFilePath = `excel/initial/${excelFileName}-${date}${chance.string(
    { length: 12 }
  )}.json`;
  const processedExcelFilePath = `excel/processed/${excelFileName}-${date}${chance.string(
    { length: 12 }
  )}.json`;
  const isDocPresent = docFile ? true : false;
  const fileData = {
    initialExcelFile: initialExcelFilePath,
    processedExcelFile: processedExcelFilePath,
    userRef: userId,
    name,
    initialFileSize,
    processedFileSize,
    intialExcelFileCount,
    processedExcelFileDispatchedCount,
    docFile: isDocPresent ? `docFile/${date}-${docFile.originalname}` : null,
    orderType,
    processedExcelFileIndianPostDeliveryCount,
    processedExcelFileShipRocketDeliveryCount,
    isDocPresent,
  };
  if (body.university) {
    fileData.university = body.university;
  }

  const initialFileUrl = await putObjectUrl(initialExcelFilePath);
  const processedFileUrl = await putObjectUrl(processedExcelFilePath);

  await axios.put(initialFileUrl, compress(initialFileJson));
  await axios.put(processedFileUrl, compress(processedFileJson));

  if (isDocPresent) {
    const docFileUrl = await putObjectUrl(
      `docFile/${date}-${docFile.originalname}`
    );
    await axios.put(docFileUrl, docFile);
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

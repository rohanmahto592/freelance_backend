const {
  calculateFileSize,
  validateExcel,
  prepareWorkbook,
} = require("../Utils/validateExcelHelper");
const xlsx = require("xlsx");
const { SendExcelSheet } = require("../Utils/emailHelper");
const {
  getFileStatus,
  createFileTemplate,
  updateFileData,
  deleteUnProcessedFile,
} = require("../Models/StoreFileModel");
const File = require("../Schema/fileSchema");
const mongoose = require("mongoose");
const { generateCredentials } = require("../Utils/credentialHelper");
const { createDelivery } = require("../Models/deliveryModel");
const { updatecartItem } = require("../Models/adminModel");
const { getMandatoryFields } = require("../Utils/getMandatoryFields");
const { getObjectUrl } = require("../Utils/awsS3Util");
const axios = require("axios");

function removeLeftCharacters(string) {
  const index = string.indexOf("$"); // Find the index of the dollar sign
  if (index !== -1) {
    return string.slice(index + 1); // Return the substring starting from the dollar sign
  } else {
    return string; // If the dollar sign is not found, return the original string
  }
}
async function processExcellSheet(req, res) {
  try {
    const excelfile = req.files[0];
    const docfile = req.files[1];
    const user = req.user;
    const { orderType, university, items } = req.body;

    let workbook_response, excelHeaderMap, docFile, intialFileSize;
    if (orderType !== "FARE") {
      const workbook = xlsx.read(excelfile.buffer, { type: "buffer" });
      let workbook_sheets = workbook.SheetNames;
      workbook_response = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook_sheets[0]],
        { defval: "" }
      );
      intialFileSize = calculateFileSize(excelfile.buffer);
      if (intialFileSize > 20000000) {
        res.status(400).send({
          success: false,
          message: "File size is more then 20 MB",
        });
        return;
      }
      const { isValid, headerMap } = await validateExcel(
        workbook_response[0],
        orderType
      );
      excelHeaderMap = headerMap;
      const Headers = await getMandatoryFields(orderType);
      if (!isValid) {
        res.send({
          success: false,
          validation: isValid,
          headerInvalid: true,
          message:
            "All the required headers are not present,check and reformat your excel file",
          orderType,
          Headers,
        });
        return;
      }
    } else {
      workbook_response = [];
      const jsonItems = JSON.parse(items);

      const jsonItemKeys = Object.keys(jsonItems);

      for (let i = 0; i < jsonItemKeys.length; i++) {
        let itemsStringified = jsonItems[jsonItemKeys[i]].join(",");

        const items = itemsStringified.split(",");
        const values = items.map((item) => {
          return removeLeftCharacters(item);
        });
        itemsStringified = values.join(" , ");
        const itemVal = jsonItems[jsonItemKeys[i]];
        for (let j = 0; j < itemVal.length; j++) {
          await updatecartItem({
            id: itemVal[j].split("$")[0],
            quantity: itemVal[j].split("-")[1],
            type: "subtract",
          });
        }

        workbook_response.push({
          "application id": `App ID-${Date.now()}-${i}`,
          "street address 1": jsonItemKeys[i],
          orderType: orderType,
          items: itemsStringified,
          "awb no": "",
          "country courier code": "",
        });
      }
    }
    const newFile = await createFileTemplate();
    res.send({
      success: true,
      isProcessed: false,
      message: "Excel sheet is being processed",
      id: newFile._id,
    });
    const JsonWorkbookData = await prepareWorkbook(
      workbook_response,
      excelHeaderMap,
      orderType,
      university
    );
    if (JsonWorkbookData) {
      let excelFileName = excelfile?.originalname?.split(".")[0]|| `FARE ${new Date().toString()}`;
      await updateFileData(
        excelFileName,
        workbook_response,
        JsonWorkbookData,
        user,
        intialFileSize || 0,
        excelfile?.originalname
          ? excelfile.originalname
          : `FARE ${new Date().toString()}`,
        docfile,
        { orderType, university },
        newFile._id
      );
      SendExcelSheet(JsonWorkbookData, docfile,user,excelFileName);
      const userData = generateCredentials(newFile._id,JsonWorkbookData,excelFileName);

      await createDelivery(userData);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getProcessedSheetStatus(req, res) {
  try {
    const { id } = req.body;
    const isProcessed = await getFileStatus(id);
    if (isProcessed) {
      res.send({
        success: true,
        isProcessed,
        message: "File processed successfully",
      });
    } else {
      res.send({
        success: true,
        isProcessed,
        message: "File is being processed",
      });
    }
  } catch {
    res.send({
      success: false,
      isProcessed: false,
      message: "Something went wrong, please try again later",
    });
  }
}

async function deleteUnProcessedExcelFile(req, res) {
  const { id } = req.body;
  await deleteUnProcessedFile(id);
  res.send({ success: true, message: "file deleted successfully" });
}

async function getExcelSheet(req, res) {
  try {
    const userId = req.user;
    const response = await File.find({
      userRef: new mongoose.Types.ObjectId(userId),
    })
      .select(
        "_id userRef initialFileSize processedFileSize intialExcelFileCount name processedExcelFileDispatchedCount processedExcelFileShipRocketDeliveryCount processedExcelFileIndianPostDeliveryCount orderType createdAt updatedAt isDocPresent"
      )
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.send({
      success: false,
      message: "Not able to fetch data,please try again later",
    });
  }
}
async function deleteExcelFile(req, res) {
  try {
    const userId = req.body.id;
    const response = await File.deleteOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    res.send({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.send({ success: false, message: "Internal Server Error" });
  }
}
async function getFile(req, res) {
  try {
    const { _id, type } = req.body;

    const response = await File.find({
      _id: new mongoose.Types.ObjectId(_id),
    }).select(`${type}  name createdAt`);
    const path = response && response.length && response[0][type];

    let file;
    if (path) {
      const url = await getObjectUrl(path);
      file = await axios.get(url);
    }

    res.status(200).json({
      success: true,
      message: {
        [type]: file.data,
        name: response[0].name,
        createdAt: response[0].createdAt,
      },
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Not able to fetch file,please try again later",
    });
  }
}

module.exports = {
  processExcellSheet,
  getExcelSheet,
  deleteExcelFile,
  getFile,
  getProcessedSheetStatus,
  deleteUnProcessedExcelFile,
};

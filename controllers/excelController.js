const {
  calculateFileSize,
  validateExcel,
  prepareWorkbook,
} = require("../Utils/validateExcelHelper");
const { convertDocToBuffer } = require("../Utils/docHelper");
const xlsx = require("xlsx");
const { SendExcelSheet } = require("../Utils/emailHelper");
const { storeFile } = require("../Models/StoreFileModel");
const File = require("../Schema/fileSchema");
const mongoose = require("mongoose");
const { generateCredentials } = require("../Utils/credentialHelper");
const { createDelivery } = require("../Models/deliveryModel");
const { updatecartItem } = require("../Models/adminModel");
const { getMandatoryFields } = require("../Utils/getMandatoryFields");

async function processExcellSheet(req, res) {
  try {
    const excelfile = req.files[0];
    const docfile = req.files[1];
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
      if (intialFileSize > 50000000) {
        res.status(400).send({
          success: false,
          message: "File size is more then 50 MB",
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
        const regex = /\$[a-zA-Z0-9-]+/g;
        const matches = itemsStringified.match(regex);
        const values = matches.map((match) => match.slice(1));
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
    const JsonWorkbookData = await prepareWorkbook(
      workbook_response,
      excelHeaderMap,
      orderType,
      university
    );

    if (docfile) {
      docFile = await convertDocToBuffer(docfile.buffer, docfile.originalname);
    }
    if (JsonWorkbookData) {
      const info = await storeFile(
        workbook_response,
        JsonWorkbookData,
        req.user,
        intialFileSize || 0,
        excelfile?.originalname,
        docFile,
        req.body
      );
      SendExcelSheet(JsonWorkbookData);
      const userData = generateCredentials(info._id);

      await createDelivery(userData);
      res.send({ success: true, message: "ExcelSheet Processed Successfully" });
    } else {
      res.send({
        success: false,
        message: "Something went wrong, Please try again later.",
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ success: false, message: "ExcelSheet Couldn't be processed" });
  }
}

async function getExcelSheet(req, res) {
  try {
    const userId = req.user;
    const response = await File.find({
      userRef: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    res.send({ success: true, message: response });
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

module.exports = { processExcellSheet, getExcelSheet, deleteExcelFile };

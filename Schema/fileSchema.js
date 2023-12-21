const mongoose = require("mongoose");
// const  = require("mongodb");
const excelSchema = new mongoose.Schema(
  {
    initialExcelFile: {
      type: Buffer,
    },
    processedExcelFile: {
      type: Buffer,
    },
    docFile: {
      name: String,
      buffer: Buffer,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    initialFileSize: {
      type: String,
    },
    processedFileSize: {
      type: String,
    },
    name: {
      type: String,
    },
    intialExcelFileCount: {
      type: String,
    },
    processedExcelFileDispatchedCount: {
      type: String,
    },
    processedExcelFileShipRocketDeliveryCount: {
      type: String,
    },
    processedExcelFileIndianPostDeliveryCount: {
      type: String,
    },
    orderType: {
      type: String,
    },
    university: {
      type: String,
    },
    isDocPresent: {
      type: Boolean,
      default: false,
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", excelSchema);

module.exports = File;

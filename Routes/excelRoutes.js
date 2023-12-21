const express = require("express");
const {
  processExcellSheet,
  getExcelSheet,
  deleteExcelFile,
  getFile,
  getProcessedSheetStatus,
  deleteUnProcessedExcelFile,
} = require("../controllers/excelController");
const multer = require("multer");
const { validateUser } = require("../Middleware/ValidateUser");
const { rateLimiteMiddleWare } = require("../Utils/rateLimiter");
const router = express.Router();
const upload = multer();
router.get("/getExcelSheet", validateUser, getExcelSheet);
router.post("/file/getFile", validateUser, getFile);
router.post("/file/getFileStatus", getProcessedSheetStatus);
router.post("/file/deleteIdealFile", deleteUnProcessedExcelFile);
router.post(
  "/processExcel",
  upload.array("files", 2),
  validateUser,
  processExcellSheet
);
router.post("/processExcel/delete", validateUser, deleteExcelFile);
module.exports = router;

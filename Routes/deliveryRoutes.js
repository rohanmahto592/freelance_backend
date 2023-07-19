const express = require("express");
const multer = require("multer");
const { validateUser } = require("../Middleware/ValidateUser");
const { uploadDeliveryExcelSheet } = require("../controllers/deliveryController");
const router = express.Router();
const upload = multer();
router.post("/delivery/uploadExcel",upload.single("file"),validateUser,uploadDeliveryExcelSheet);

module.exports=router;
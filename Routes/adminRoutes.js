const express = require("express");
const { validateUser,validateAdmin } = require("../Middleware/ValidateUser");
const {
  allUsers,
  verifyUsers,
  deleteUser,
  addItem,
  getItems,
  updateCartItem,
  getItemNames,
  addStock,
  addCollege,
  fetchColleges,
  addExcelHeaderController,
  fetchExcelHeadersController,
  deleteExcelHeaderController,
  deleteCollege,
  deleteCurrentItem,
  addNonServicableCountries,
  getInvalidCountries,
  addIndianPostCountryPrice,
  getExcelSheetInfo,
  getOrders,
  fetchAllUsers,
  deleteNonServicableCountries,
  userEmails,
  addUserEmail,
  deleteUserEmail,
  
} = require("../controllers/adminController.js");
const router = express.Router();
const multer = require("multer");
const { rateLimiteMiddleWare } = require("../Utils/rateLimiter.js");
const upload = multer();
router.get("/admin/getusers", validateAdmin, allUsers);
router.get("/admin/getUserEmails",validateAdmin,userEmails);
router.post("/admin/addUserEmail",validateAdmin,addUserEmail);
router.post("/admin/deleteUserEmail",validateAdmin,deleteUserEmail);
router.post("/admin/verifyusers", validateAdmin, verifyUsers);
router.post("/admin/user/delete", validateAdmin, deleteUser);
router.post("/admin/additem", upload.single("file"), validateAdmin, addItem);
router.get("/admin/getstockitem", validateUser, getItems);
router.put("/admin/updateItem", validateAdmin, updateCartItem);
router.get("/admin/getItemNames", validateUser, getItemNames);
router.post("/admin/addStock", validateAdmin, addStock);
router.post("/admin/addCollege", validateAdmin, addCollege);
router.get("/admin/getColleges", validateUser, fetchColleges);
router.post("/admin/addExcelHeader", validateAdmin, addExcelHeaderController);
router.get("/admin/getExcelHeader", validateAdmin, fetchExcelHeadersController);
router.post(
  "/admin/deleteExcelHeader",
  validateUser,
  deleteExcelHeaderController
);
router.delete("/admin/deletecollege",validateAdmin,deleteCollege);
router.delete("/admin/deleteCurrentItem",validateAdmin,deleteCurrentItem)
router.post("/admin/add/nonServicableCountries",validateAdmin,addNonServicableCountries);
router.get("/admin/get/nonServicableCountries",validateAdmin,getInvalidCountries);
router.post("/admin/add/indianpost/country/price",addIndianPostCountryPrice);
router.get("/admin/get/excelsheetinfo",validateUser,getExcelSheetInfo);
router.get("/admin/get/fetchOrders",validateUser,getOrders)
router.get("/admin/get/fetchAllUsers",validateUser,fetchAllUsers);
router.delete("/admin/deletecollege", validateAdmin, deleteCollege);
router.delete("/admin/deleteCurrentItem", validateAdmin, deleteCurrentItem);
router.post(
  "/admin/add/nonServicableCountries",
  validateAdmin,
  addNonServicableCountries
);
router.get(
  "/admin/get/nonServicableCountries",
  validateAdmin,
  getInvalidCountries
);
router.post("/admin/add/indianpost/country/price", addIndianPostCountryPrice);
router.get("/admin/get/excelsheetinfo", validateAdmin, getExcelSheetInfo);
router.get("/admin/get/fetchOrders", validateUser, getOrders);
router.delete(
  "/admin/deleteCountry",
  validateAdmin,
  deleteNonServicableCountries
);

module.exports = router;

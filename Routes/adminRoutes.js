const express = require("express");
const { validateUser } = require("../Middleware/ValidateUser");
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
router.get("/admin/getusers", validateUser, allUsers);
router.get("/admin/getUserEmails",validateUser,userEmails);
router.post("/admin/addUserEmail",validateUser,addUserEmail);
router.post("/admin/deleteUserEmail",validateUser,deleteUserEmail);
router.post("/admin/verifyusers", validateUser, verifyUsers);
router.post("/admin/user/delete", validateUser, deleteUser);
router.post("/admin/additem", upload.single("file"),rateLimiteMiddleWare, validateUser, addItem);
router.get("/admin/getstockitem", validateUser, getItems);
router.put("/admin/updateItem", validateUser, updateCartItem);
router.get("/admin/getItemNames", validateUser, getItemNames);
router.post("/admin/addStock", rateLimiteMiddleWare, validateUser, addStock);
router.post("/admin/addCollege", validateUser, addCollege);
router.get("/admin/getColleges", fetchColleges);
router.post("/admin/addExcelHeader", validateUser, addExcelHeaderController);
router.get("/admin/getExcelHeader", validateUser, fetchExcelHeadersController);
router.post(
  "/admin/deleteExcelHeader",
  validateUser,
  deleteExcelHeaderController
);
router.delete("/admin/deletecollege",validateUser,deleteCollege);
router.delete("/admin/deleteCurrentItem",validateUser,deleteCurrentItem)
router.post("/admin/add/nonServicableCountries",validateUser,addNonServicableCountries);
router.get("/admin/get/nonServicableCountries",validateUser,getInvalidCountries);
router.post("/admin/add/indianpost/country/price",addIndianPostCountryPrice);
router.get("/admin/get/excelsheetinfo",validateUser,getExcelSheetInfo);
router.get("/admin/get/fetchOrders",validateUser,getOrders)
router.get("/admin/get/fetchAllUsers",validateUser,fetchAllUsers);
router.delete("/admin/deletecollege", validateUser, deleteCollege);
router.delete("/admin/deleteCurrentItem", validateUser, deleteCurrentItem);
router.post(
  "/admin/add/nonServicableCountries",
  validateUser,
  addNonServicableCountries
);
router.get(
  "/admin/get/nonServicableCountries",
  validateUser,
  getInvalidCountries
);
router.post("/admin/add/indianpost/country/price", addIndianPostCountryPrice);
router.get("/admin/get/excelsheetinfo", validateUser, getExcelSheetInfo);
router.get("/admin/get/fetchOrders", validateUser, getOrders);
router.delete(
  "/admin/deleteCountry",
  validateUser,
  deleteNonServicableCountries
);

module.exports = router;

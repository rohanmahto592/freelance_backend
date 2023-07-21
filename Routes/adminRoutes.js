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
} = require("../controllers/adminController.js");
const router = express.Router();
const multer = require("multer");
const upload = multer();
router.get("/admin/getusers", validateUser, allUsers);
router.post("/admin/verifyusers", validateUser, verifyUsers);
router.post("/admin/user/delete", validateUser, deleteUser);
router.post("/admin/additem", upload.single("file"), validateUser, addItem);
router.get("/admin/getstockitem", validateUser, getItems);
router.put("/admin/updateItem", validateUser, updateCartItem);
router.get("/admin/getItemNames", validateUser, getItemNames);
router.post("/admin/addStock", validateUser, addStock);
router.post("/admin/addCollege", validateUser, addCollege);
router.get("/admin/getColleges", validateUser, fetchColleges);
router.post("/admin/addExcelHeader", validateUser, addExcelHeaderController);
router.get("/admin/getExcelHeader", validateUser, fetchExcelHeadersController);
router.post(
  "/admin/deleteExcelHeader",
  validateUser,
  deleteExcelHeaderController
);
module.exports = router;

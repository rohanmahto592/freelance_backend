const express = require("express");
const { addContactUs,forgotPassword,resetPassword } = require("../controllers/contactUsController");
const router = express.Router();

router.post("/add/contact", addContactUs);
router.post("/user/forgot-password",forgotPassword);
router.post("/user/reset-password",resetPassword)
module.exports = router;

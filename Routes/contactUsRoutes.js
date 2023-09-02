const express = require("express");
const { addContactUs } = require("../controllers/contactUsController");
const router = express.Router();

router.post("/add/contact", addContactUs);

module.exports = router;

const express = require("express");
const { validateUser, validateAdmin } = require("../Middleware/ValidateUser");
const {
  addFeedbackController,
  approveFeedbackController,
  getAllFeedbacksController,
} = require("../controllers/feedbackController");
const multer = require("multer");
const upload = multer();
const router = express.Router();

router.get("/getFeedbacks", getAllFeedbacksController);

router.post(
  "/feedback/add",
  upload.single("file"),
  validateUser,
  addFeedbackController
);

router.put("/feedback/approve", validateAdmin, approveFeedbackController);

module.exports = router;

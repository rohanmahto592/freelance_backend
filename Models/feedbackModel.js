const mongoose = require("mongoose");
const Feedback = require("../Schema/feedbackSchema");

async function addFeedback(feedbackData) {
  try {
    const newFeedback = new Feedback(feedbackData);
    const feedback = await newFeedback.save();
    if (feedback) {
      return { success: true, message: "Feedback added successfully" };
    }
    return { success: false, message: "Feedback couldn't be added" };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong, Please try again later",
    };
  }
}

async function approveFeedback(feedbackId) {
  try {
    const feedback = await Feedback.findOne({
      _id: mongoose.Types.ObjectId(feedbackId),
    });
    if (feedback) {
      feedback.isApproved = true;
      await feedback.save();
      return { success: true, message: "Feedback approved successfully" };
    }
    return { success: false, message: "Feedback couldn't be approved" };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong, Please try again later",
    };
  }
}

async function getAllFeedbacks() {
  try {
    const feedbacks = await Feedback.find({ isApproved: true });
    if (!feedbacks || (feedbacks && feedbacks.length === 0)) {
      return { success: true, message: "No feedback found" };
    }
    return { success: true, message: "Feedbacks found", feedbacks };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong, Please try again later",
    };
  }
}

module.exports = { addFeedback, approveFeedback, getAllFeedbacks };

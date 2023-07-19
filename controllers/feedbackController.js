const {
  addFeedback,
  approveFeedback,
  getAllFeedbacks,
} = require("../Models/feedbackModel");

async function addFeedbackController(req, res) {
  let feedback = req.body.feedback;
  if(!feedback){
  return res.status(404).send({ success: false, message: 'Feedack could not be added'});
  }
  feedback = JSON.parse(feedback)
  const image = `data:image/jpeg;base64,${req?.file.buffer.toString('base64')}`;
  const newFeedback = await addFeedback({ ...feedback, image });
  if (newFeedback.success) {
    return res.status(200).send(newFeedback);
  }
  return res.status(404).send(newFeedback);
}

async function approveFeedbackController(req, res) {
  const { feedbackId } = req.body;
  const approvedFeedback = await approveFeedback(feedbackId);
  if (approvedFeedback.success) {
    return res.status(200).send(approvedFeedback);
  }
  return res.status(404).send(approvedFeedback);
}

async function getAllFeedbacksController(req, res) {
  const response = await getAllFeedbacks();
  if (!response.success) {
    return res.status(404).send(response);
  }
  return res.status(200).send(response);
}

module.exports = {
  addFeedbackController,
  approveFeedbackController,
  getAllFeedbacksController,
};

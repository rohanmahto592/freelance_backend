const { addContactUsInfo } = require("../Models/cotactUsModel");
const { sendContactUsInfo } = require("../Utils/emailHelper");

async function addContactUs(req, res) {
  const contactUsData = req.body;
  const response = await addContactUsInfo(contactUsData);
  sendContactUsInfo(req.body);
  res.send(response);
}

module.exports = {
  addContactUs,
};

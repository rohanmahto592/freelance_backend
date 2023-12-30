const Contact = require("../Schema/contactUsSchema");

async function addContactUsInfo(data) {
  try {
    const response = new Contact(data);
    await response.save();
    return { success: true, message: response };
  } catch (err) {
    return {
      success: false,
      message: "failed to store the query,try again after sometime",
    };
  }
}

module.exports = {
  addContactUsInfo,
};

const Chance = require("chance");
const { passwordEncryption, passwordValidation } = require("./passwordHelper");
const { sendGuestCredentials } = require("./emailHelper");
const { findUser } = require("../Models/userCredentialModel");
const { findDeliveryUser } = require("../Models/deliveryModel");
const chance = new Chance();

function generateCredentials(excelRef, workBookData, fileName) {
  const email = chance.email();
  const password = chance.string({ length: 8 });
  const hashPassword = passwordEncryption(password);
  console.log(email, "  ", password);
  sendGuestCredentials(email, password, workBookData, fileName);

  return {
    email,
    password: hashPassword,
    isVerified: true,
    excelRef,
  };
}
async function findClientDetails(email) {
  const emailInLower = email.toLowerCase();
  const response = await findUser(emailInLower);
  return response;
}

async function findDeliveryDetails(email) {
  const emailInLower = email.toLowerCase();
  const response = await findDeliveryUser(emailInLower);
  return response;
}

module.exports = {
  generateCredentials,
  findClientDetails,
  findDeliveryDetails,
};

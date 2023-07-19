const Chance = require("chance");
const { passwordEncryption, passwordValidation } = require("./passwordHelper");
const { sendGuestCredentials } = require("./emailHelper");
const { findUser } = require("../Models/userCredentialModel");
const { findDeliveryUser } = require("../Models/deliveryModel");
const chance = new Chance();

function generateCredentials(excelRef) {
  const email = chance.email();
  const password = chance.string({ length: 8 });
  const hashPassword = passwordEncryption(password);

  sendGuestCredentials(email, password);

  return {
    email,
    password: hashPassword,
    isVerified: true,
    excelRef,
  };
}
async function findClientDetails(email)
{
    const response = await findUser(email);
    return response;
  }

    
async function findDeliveryDetails(email)
{
  const response = await findDeliveryUser(email);
  return response;
}

module.exports = { generateCredentials,findClientDetails,findDeliveryDetails };

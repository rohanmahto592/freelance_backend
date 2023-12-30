const { addContactUsInfo } = require("../Models/cotactUsModel");
const { findUser } = require("../Models/userCredentialModel");
const {
  sendContactUsInfo,
  sendResetPasswordLink,
} = require("../Utils/emailHelper");
const { generateOtp } = require("../Utils/jwtAuthHelper");
const {
  passwordEncryption,
  passwordValidation,
} = require("../Utils/passwordHelper");
const User = require("../Schema/credentialSchema");

async function addContactUs(req, res) {
  const contactUsData = req.body;
  const response = await addContactUsInfo(contactUsData);
  sendContactUsInfo(req.body);
  res.send(response);
}
async function forgotPassword(req, res) {
  const { email } = req.body;
  const isUserPresent = await User.findOne({ email });
  if (!isUserPresent) {
    res.send({
      success: false,
      message:
        "User Not found for particular email, please enter a valid email.",
    });
    return;
  }
  const otp = generateOtp();
  const encryptedOtp = passwordEncryption(otp.toString());
  const response = await sendResetPasswordLink(email, otp);
  if (response.Status == "success") {
    res.send({
      success: true,
      token: encryptedOtp,
      email: response.To[0].Email,
      message: "Otp send successfully to the email.",
    });
  } else {
    res.send({
      success: false,
      message: "failed to send the otp to the email,try again after sometime.",
    });
  }
}
async function resetPassword(req, res) {
  const { email, otp, token, password } = req.body;
  const isValidToken = passwordValidation(otp.toString(), token);
  if (isValidToken) {
    const user = await findUser(email);
    if (!user.success) {
      res.send(user);
    } else {
      const hashPassword = passwordEncryption(password);
      const user = await User.findOne({ email });
      user.password = hashPassword;
      await user.save();
      res.send({ success: true, message: "Password reset successfully" });
    }
  } else {
    res.send({ success: false, message: "Wrong otp!!" });
  }
}
module.exports = {
  addContactUs,
  forgotPassword,
  resetPassword,
};

const {
  passwordEncryption,
  passwordValidation,
} = require("../Utils/passwordHelper");
const { createUser, findUser } = require("../Models/userCredentialModel");
const { create_Token } = require("../Utils/jwtAuthHelper");
const {
  findClientDetails,
  findDeliveryDetails,
} = require("../Utils/credentialHelper");
async function register(req, res) {
  const {
    firstName,
    lastName,
    dob,
    universityName,
    userType,
    email,
    password,
  } = req.body;
  console.log(req.body);
  const hashPassword = passwordEncryption(password);
  const userData = {
    firstName,
    lastName,
    dob,
    universityName,
    userType,
    email,
    password: hashPassword,
  };
  const response = await createUser(userData);
  res.send(response);
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const userResponse = await findClientDetails(email);
    const deliveryUserResponse = await findDeliveryDetails(email);
    if (!userResponse.success && !deliveryUserResponse.success) {
      return res.send(deliveryUserResponse);
    } else if (!userResponse.success && deliveryUserResponse.success) {
      const isPasswordValid = passwordValidation(
        password,
        deliveryUserResponse.user.password
      );

      if (!isPasswordValid) {
        return res.send({ success: false, message: "Incorrect Password" });
      }

      if (!deliveryUserResponse.user.isVerified) {
        return res.send({
          success: false,
          message: "User Not Verified, Please Contact Your Administrator",
        });
      }

      const token = create_Token({
        email: deliveryUserResponse.user.email,
        _id: deliveryUserResponse.user._id,
      });

      return res.set("Authorization", `Bearer ${token}`).status(200).send({
        success: true,
        message: "Logged In Successfully",
        userType: "DELIVERY",
        userId: deliveryUserResponse.user._id,
      });
    } else {
      const isPasswordValid = passwordValidation(
        password,
        userResponse.user.password
      );

      if (!isPasswordValid) {
        return res.send({ success: false, message: "Incorrect Password" });
      }

      if (!userResponse.user.isVerified) {
        return res.send({
          success: false,
          message: "User Not Verified, Please Contact Your Administrator",
        });
      }

      const token = create_Token({
        email: userResponse.user.email,
        _id: userResponse.user._id,
        isAdmin: userResponse.user.isAdmin,
      });

      return res
        .set("Authorization", `Bearer ${token}`)
        .status(200)
        .send({
          success: true,
          message: "Logged In Successfully",
          userType: userResponse.user.userType,
          id: userResponse.user._id,
          universityName: userResponse?.user?.universityName,
          firstName: userResponse.user.firstName
            ? userResponse.user.firstName
            : "",
          lastName: userResponse.user.lastName
            ? userResponse.user.lastName
            : "",
        });
    }
  } catch (err) {
    console.log("Error Occurred : ", err);
    return res
      .status(500)
      .send({ success: false, message: "Something Went Wrong" });
  }
}
module.exports = { register, login };

const { verify_Token } = require("../Utils/jwtAuthHelper");

function validateUser(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res.send({ success: false, message: "Unauthorized user" });
  }
  token = token.split(" ")[1];
  const response = verify_Token(token);
  if (!response) {
    return res.send({
      success: false,
      message: "Unauthorized user,please login.",
    });
  }
  console.log(response)
  req.user = response?._id;
  req.userEmail = response?.email;
  next();
}

function validateAdmin(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res.send({ success: false, message: "Unauthorized user" });
  }
  token = token.split(" ")[1];
  const response = verify_Token(token);
  if (!response || (response && !response.isAdmin)) {
    return res.send({
      success: false,
      message: "Unauthorized user,please login.",
    });
  }
  req.user = response?._id;
  next();
}
module.exports = { validateUser, validateAdmin };

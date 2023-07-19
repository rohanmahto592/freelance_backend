const User = require("../Schema/credentialSchema");

async function createUser(userData) {
  try {
    const newUser = new User(userData);
    const user = await newUser.save();

    if (user) {
      return { success: true, message: "User Registered Successfully" };
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };
  } catch (err) {
    console.log(err.message);
    return { success: false, message: err.message };
  }
}

async function findUser(email) {
  try{
    const user = await User.findOne({ email });
    if(!user){
      return { success: false, message: "User Not Found" };
    }
    return { success: true, user };
  } catch(err) {
    console.log(err.message);
    return { success: false, message: err.message };
  }
}


module.exports = {createUser, findUser};

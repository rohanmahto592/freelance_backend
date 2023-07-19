const Delivery = require("../Schema/deliverySchema");

async function createDelivery(userData) {
  try {
    const newUser = new Delivery(userData);
    const user = await newUser.save();

    if (user) {
      return { success: true, message: "User Registered Successfully" };
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
async function findDeliveryUser(email) {
  try{
    const user = await Delivery.findOne({ email });
    if(!user){
      return { success: false, message: "User Not Found" };
    }
    return { success: true, user };
  } catch(err) {
    return { success: false, message: err.message };
  }
}

module.exports = { createDelivery,findDeliveryUser };

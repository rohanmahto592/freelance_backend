const { Mongoose } = require("mongoose");
const Order = require("../Schema/OrderSchema");
const DeliveryCredentials = require("../Schema/deliverySchema");

const getUserDeliveryExcelRefById = async (id) => {
  try {
    const excelSheetRef = await DeliveryCredentials.findById(id);
    return { success: true, message: excelSheetRef.excelRef };
  } catch (err) {
    return { success: false, message: "not found" };
  }
};

async function createOrder(orderData, session) {
  console.log(orderData)
  try {
    const orderExist = await Order.findOne({
      applicationId: orderData.applicationId,
    });
   // console.log(orderExist);
    if (!orderExist) {
      const newOrder = new Order(orderData);
      const order = await newOrder.save({ session });

      if (order) {
        return { success: true, message: "Order added successfully" };
      }
    } else if (orderExist && orderExist.orderType !== "ADMIT") {
      return {
        success: false,
        isDuplicate: true,
        message: "Entry already exist",
      };
    } else if (orderExist && orderExist.orderType === "ADMIT") {
      if (orderData.orderType !== "DEPOSIT") {
        return {
          success: false,
          isDuplicate: true,
          message: "Entry already exist",
        };
      }
      orderExist.orderType = orderData.orderType;
      const updatedOrder = await orderExist.save();
      // console.log(updatedOrder);
      if (updatedOrder) {
        return { success: true, message: "Order added successfully" };
      }
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };
  } catch (err) {
    console.log(err.message);
    if (err.code === 11000) {
      return {
        success: false,
        isDuplicate: true,
        message: "Duplicate keys found in excel",
      };
    }
    return { success: false, message: err.message };
  }
}

module.exports = { createOrder, getUserDeliveryExcelRefById };

const users = require("../Schema/credentialSchema");
const additem = require("../Schema/Item");
const Stock = require("../Schema/Stock");
const College = require("../Schema/collegeSchema");
const ExcelHeader = require("../Schema/excelHeadersSchema");
const NonServicableCountry = require("../Schema/nonServicableCountires");
const indianPostService = require("../Schema/indianPostSchema");
const excelFile = require("../Schema/fileSchema");
const Order = require("../Schema/OrderSchema");
const { default: mongoose } = require("mongoose");
const userEmail = require("../Schema/userEmailSchema");
const stock = require("../Schema/Stock");
const { getObjectUrl } = require("../Utils/awsS3Util");
const axios = require("axios");
async function getAllUsers(isVerified) {
  if (isVerified == "true") {
    try {
      const response = await users.find({ isVerified: true, isAdmin: false });
      return { success: true, message: response };
    } catch (err) {
      return {
        success: false,
        message: "Failed to fetch the Users,try again after sometime",
      };
    }
  } else {
    try {
      const response = await users.find({ isVerified: false });
      return { success: true, message: response };
    } catch (err) {
      return {
        success: false,
        message: "Failed to fetch the Users,try again after sometime",
      };
    }
  }
}
async function verifySelectedUsers(userIds) {
  try {
    await users
      .updateMany(
        { _id: { $in: userIds } }, // filter by user IDs in the given array
        { $set: { isVerified: true } } // update the isVerified field to true
      )
      .exec();
    return { success: true, message: "Selected users verified successfully" };
  } catch (err) {
    return { success: false, message: "Failed to verified the user" };
  }
}

async function deleteRejectedUsers(userIds) {
  try {
    await users.deleteMany({ _id: { $in: userIds } }).exec();
    return { success: true, message: "Selected users deleted successfully" };
  } catch (err) {
    return { success: false, message: "Failed to delete the user" };
  }
}

async function deleteSelectedUser(userId) {
  try {
    await users.findByIdAndDelete(userId);
    return { success: true, message: "Selected user deleted successfully" };
  } catch (err) {
    return { success: false, message: "Failed to delete the user" };
  }
}
async function addItems(data) {
  try {
    const item = new additem(data);
    const response = await item.save();
    if (response) {
      return { success: true, message: "Item Added  Successfully" };
    }
    return {
      success: false,
      message: "Failed to add item in the cart",
    };
  } catch (err) {
    return { success: false, message: "Failed to add item in the cart" };
  }
}
async function fetchItems() {
  try {
    const response = await Stock.find({}).populate({
      path: "itemRef",
      select: "description image",
    });
    if (response) {
      return { success: true, message: response };
    }
    return {
      success: false,
      message: "Failed to fetch list items",
    };
  } catch (err) {
    return { success: false, message: "Failed to fetch list items" };
  }
}
async function updatecartItem(data) {
  const { id, quantity, type = "update" } = data;
  try {
    const item = await Stock.findOne({ _id: id });
    if (item) {
      if (type === "subtract") {
        item.quantity = item.quantity - quantity;
        console.log(item.quantity);
      } else {
        item.quantity = quantity;
      }
      await item.save();
      return { success: true, message: "Stock updated successfully" };
    }
    return { success: false, message: "Failed to update cart ite" };
  } catch (err) {
    return { success: false, message: "Failed to update cart item" };
  }
}
async function getItemListNames() {
  try {
    const response = await additem.find().select("_id name");
    if (response) {
      return { success: true, message: response };
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };
  } catch (err) {
    return { success: false, message: "Failed to fetch list items" };
  }
}
async function addStockItem(stockData) {
  try {
    const { itemRef, quantity, university } = stockData;
    const item = await Stock.findOne({
      itemRef: itemRef,
      university: university,
    });
    if (item) {
      item.quantity = (
        parseInt(item.quantity ? item.quantity : 0) + parseInt(quantity)
      ).toString();
      await item.save();
      return { success: true, message: "Stock updated successfully" };
    }
    const stock = new Stock(stockData);
    const response = await stock.save();
    if (response) {
      return { success: true, message: "Stock Added  Successfully" };
    }
    return {
      success: false,
      message: "Failed to add item in the stock",
    };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to add item in the stock" };
  }
}
async function addColleges(collegeInfo) {
  try {
    const response = new College(collegeInfo);
    await response.save();
    return { success: true, message: "College added successfully" };
  } catch (err) {
    return { success: false, message: "Failed to add college" };
  }
}
async function FetchColleges() {
  try {
    const response = await College.find();
    return { success: true, message: response };
  } catch (err) {
    return { success: false, message: "Failed to fetch college lists." };
  }
}

async function AddExcelHeader(header) {
  try {
    let { name, orderType } = header;
    const response = new ExcelHeader({ name: name.toLowerCase(), orderType });
    await response.save();
    return { success: true, message: "Header added successfully" };
  } catch (err) {
    return { success: false, message: "Failed to add excel header" };
  }
}

async function deleteExcelHeader(id) {
  try {
    await ExcelHeader.findByIdAndDelete(id);
    return { success: true, message: "Header deleted successfully" };
  } catch (err) {
    return { success: false, message: "Failed to delete excel header" };
  }
}

async function fetchExcelHeaders(orderType) {
  try {
    const response = await ExcelHeader.find({ orderType });
    return { success: true, message: response };
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch excel headers,internal server error",
    };
  }
}
async function deleteColleById(id) {
  try {
    const response = await College.findByIdAndDelete(id);
    return { success: true, message: "College deleted successfully" };
  } catch (err) {
    return {
      success: false,
      message: "Failed to delete the college,try again after sometime",
    };
  }
}
async function deleteItem(id) {
  try {
    const response = await Stock.findByIdAndDelete(id);
    return { success: true, message: "Item deleted successfully" };
  } catch (err) {
    return {
      success: false,
      message: "Failed to delete the item,try again after sometime",
    };
  }
}
async function addCountry(country) {
  try {
    const response = new NonServicableCountry({ name: country });
    await response.save();
    return { success: true, message: "Country added successfully" };
  } catch (err) {
    return {
      success: false,
      message: "Failed to add the country,try again after sometime",
    };
  }
}
async function getCountry() {
  try {
    const response = await NonServicableCountry.find();
    return { success: true, message: response };
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch the country,try again after sometime",
    };
  }
}
async function addIndianPost(data) {
  try {
    const response = new indianPostService(data);
    await response.save();
    return { success: true, message: response };
  } catch (err) {
    return {
      success: false,
      message:
        "Failed to add international country consignment details,try again after sometime",
    };
  }
}
async function getExcelSheets(id) {
  try {
    const response = await excelFile
      .find({ userRef: new mongoose.Types.ObjectId(id) })
      .select("_id userRef name orderType createdAt").sort({ createdAt: -1 });
    return { success: true, message: response };
  } catch (err) {
    return { success: false, message: "Failed to fetch excelsheet Details" };
  }
}
async function getDispatchedOrders(id) {
  try {
    const response = await Order.find({ excelSheetRef: id });
    if (response.length > 0) {
      return { success: true, message: response, isOne: false };
    } else {
      //console.log(id)
      const response = await excelFile
        .find({ _id: new mongoose.Types.ObjectId(id) })
        .select("processedExcelFile");
      const initialProcessedFile = await getObjectUrl(
        response[0].processedExcelFile
      );
      const Data = await axios.get(initialProcessedFile);
      const { dispatched, ShipRocket_Delivery, IndianPost_Delivery } =
        Data.data;
      const orders = [
        ...dispatched,
        ...ShipRocket_Delivery,
        ...IndianPost_Delivery,
      ];
      return { success: true, message: orders, isOne: true };
    }
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch order details,try again after sometime",
    };
  }
}
async function getNonAdminUsers() {
  try {
    const response = await users
      .find({ isAdmin: false, isVerified: true })
      .select("_id firstName lastName email universityName userType");
    return { success: true, message: response };
  } catch (err) {
    return { success: false, message: "Failed to fetch user details" };
  }
}
async function deleteCountry(id) {
  try {
    await NonServicableCountry.findByIdAndDelete(id);
    return { success: true, message: "Country deleted Successfully" };
  } catch (err) {
    return { success: false, message: "Failed to delete the country" };
  }
}
async function getUserEmails(userType) {
  try {
    const response = await userEmail.find({ userType });
    return { success: true, message: response };
  } catch (err) {
    return { success: false, message: "Unable to fetch Email" };
  }
}
async function AddUserEmail(data) {
  try {
    const response = new userEmail(data);
    await response.save();
    return { success: true, message: "Email added successfully" };
  } catch (err) {
    return {
      success: false,
      message: "Failed to add user email",
    };
  }
}
async function DeleteUserEmail(id) {
  try {
    await userEmail.findByIdAndDelete(id);
    return { success: true, message: "Email deleted Successfully" };
  } catch (err) {
    return { success: false, message: "Failed to delete the email" };
  }
}
async function deleteStockByCollegeAddress(address) {
  try {
    await stock.deleteMany({ university: address });
    return {
      success: true,
      message: "deleted college and corresponding stock items",
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to delete the corresponding stock items",
    };
  }
}
module.exports = {
  getAllUsers,
  verifySelectedUsers,
  deleteSelectedUser,
  addItems,
  fetchItems,
  updatecartItem,
  getItemListNames,
  addStockItem,
  addColleges,
  FetchColleges,
  AddExcelHeader,
  deleteExcelHeader,
  fetchExcelHeaders,
  deleteColleById,
  deleteItem,
  addCountry,
  getCountry,
  addIndianPost,
  getExcelSheets,
  getDispatchedOrders,
  getNonAdminUsers,
  deleteCountry,
  getUserEmails,
  AddUserEmail,
  DeleteUserEmail,
  deleteStockByCollegeAddress,
  deleteRejectedUsers,
};

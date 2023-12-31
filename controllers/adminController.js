const {
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
  fetchExcelHeaders,
  AddExcelHeader,
  deleteExcelHeader,
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
} = require("../Models/adminModel");

async function allUsers(req, res) {
  const isVerified = req.query.verified;
  const response = await getAllUsers(isVerified);
  res.send(response);
}
async function verifyUsers(req, res) {
  const { approvedUserIds, rejectedUserIds } = req.body;
  let approvedUsers = { success: true };
  let rejectedUsers = { success: true };

  if (approvedUserIds.length > 0) {
    approvedUsers = await verifySelectedUsers(approvedUserIds);
  }
  if (rejectedUserIds.length > 0) {
    rejectedUsers = await deleteRejectedUsers(rejectedUserIds);
  }

  if (approvedUsers.success && rejectedUsers.success) {
    return res.send({
      success: true,
      message: "Users status updated successfully",
    });
  } else if (!approvedUsers.success) {
    return res.send(approvedUsers);
  }
  return res.send(rejectedUsers);
}
async function deleteUser(req, res) {
  const { userId } = req.body;
  const response = await deleteSelectedUser(userId);
  res.send(response);
}
async function addItem(req, res) {
  const Image = req?.file?.buffer;
  const formData = JSON.parse(req.body.item);
  const image = Image
    ? `data:image/jpeg;base64,${Image.toString("base64")}`
    : "";
  const response = await addItems({ ...formData, image });
  res.send(response);
}
async function getItems(req, res) {
  const response = await fetchItems();
  res.send(response);
}
async function updateCartItem(req, res) {
  const Data = req.body;
  const response = await updatecartItem(Data);
  res.send(response);
}
async function getItemNames(req, res) {
  const response = await getItemListNames();
  res.send(response);
}
async function addStock(req, res) {
  const stockData = req.body;
  const response = await addStockItem(stockData);
  res.send(response);
}
async function addCollege(req, res) {
  const collegeInfo = req.body;
  const response = await addColleges(collegeInfo);
  res.send(response);
}
async function fetchColleges(req, res) {
  const response = await FetchColleges();
  res.send(response);
}

async function deleteExcelHeaderController(req, res) {
  const { id } = req.body;
  const response = await deleteExcelHeader(id);
  res.send(response);
}

async function addExcelHeaderController(req, res) {
  const header = req.body;
  const response = await AddExcelHeader(header);
  res.send(response);
}

async function fetchExcelHeadersController(req, res) {
  const { orderType } = req.query;
  const response = await fetchExcelHeaders(orderType);
  res.send(response);
}
async function deleteCollege(req, res) {
  const { id, address } = req.query;
  const response = await deleteColleById(id);
  const response2 = await deleteStockByCollegeAddress(address);
  if (response.success && response2.success) {
    res.send(response2);
  } else if (!response.success) {
    res.send(response);
  } else {
    res.send({
      success: false,
      message:
        "college deleted, but failed to delete the corresponding stock items",
    });
  }
}
async function deleteCurrentItem(req, res) {
  const { id } = req.query;
  const response = await deleteItem(id);
  res.send(response);
}
async function addNonServicableCountries(req, res) {
  const { country } = req.body;
  const response = await addCountry(country);
  res.send(response);
}
async function getInvalidCountries(req, res) {
  const response = await getCountry();
  res.send(response);
}
async function addIndianPostCountryPrice(req, res) {
  const data = req.body;
  const response = await addIndianPost(data);
  res.send(response);
}
async function getExcelSheetInfo(req, res) {
  const { id } = req.query;
  const response = await getExcelSheets(id);
  res.send(response);
}
async function getOrders(req, res) {
  const { id } = req.query;
  const response = await getDispatchedOrders(id);
  res.send(response);
}
async function fetchAllUsers(req, res) {
  const response = await getNonAdminUsers();
  res.send(response);
}
async function deleteNonServicableCountries(req, res) {
  const { id } = req.query;
  const response = await deleteCountry(id);
  res.send(response);
}
async function userEmails(req, res) {
  const { type } = req.query;
  const response = await getUserEmails(type);
  res.send(response);
}
async function addUserEmail(req, res) {
  const { userData } = req.body;
  const response = await AddUserEmail(userData);
  res.send(response);
}
async function deleteUserEmail(req, res) {
  const { id } = req.body;
  const response = await DeleteUserEmail(id);
  res.send(response);
}
module.exports = {
  deleteCollege,
  allUsers,
  verifyUsers,
  deleteUser,
  addItem,
  getItems,
  updateCartItem,
  getItemNames,
  addStock,
  addCollege,
  fetchColleges,
  deleteExcelHeaderController,
  fetchExcelHeadersController,
  addExcelHeaderController,
  deleteCurrentItem,
  addNonServicableCountries,
  getInvalidCountries,
  addIndianPostCountryPrice,
  getExcelSheetInfo,
  getOrders,
  fetchAllUsers,
  deleteNonServicableCountries,
  userEmails,
  addUserEmail,
  deleteUserEmail,
};

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
 addIndianPost
} = require("../Models/adminModel");

async function allUsers(req, res) {
  const isVerified = req.query.verified;
  const response = await getAllUsers(isVerified);
  res.send(response);
}
async function verifyUsers(req, res) {
  const userIds = req.body;
  const response = await verifySelectedUsers(userIds);
  res.send(response);
}
async function deleteUser(req, res) {
  const { userId } = req.body;
  const response = await deleteSelectedUser(userId);
  res.send(response);
}
async function addItem(req, res) {
  const Image = req?.file?.buffer;
  const formData = JSON.parse(req.body.item);
  const image = Image? `data:image/jpeg;base64,${Image.toString("base64")}`:"";
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
async function deleteCollege(req,res){
  const {id}=req.query;
  const response=await deleteColleById(id);
  res.send(response);
}
async function deleteCurrentItem(req,res){
  const {id}=req.query
  const response=await deleteItem(id);
  res.send(response);
}
async function addNonServicableCountries(req,res){
  const {country}=req.body;
  const response=await addCountry(country);
  res.send(response);
}
async function getInvalidCountries(req,res){
  const response=await getCountry();
  res.send(response);
}
async function addIndianPostCountryPrice(req,res){
  const data=req.body;
  const response=await addIndianPost(data);
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
  addIndianPostCountryPrice
};

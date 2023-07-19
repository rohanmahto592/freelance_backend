const {
  getAllUsers,
  verifySelectedUsers,
  deleteSelectedUser,
  addItems,
  fetchItems,
  updatecartItem,
  getItemListNames,
  addStockItem
} = require("../Models/adminModel");

async function allUsers(req, res) {
  const response = await getAllUsers();
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
  const image = `data:image/jpeg;base64,${Image.toString("base64")}`;
  const response = await addItems({ ...formData, image });
  res.send(response);
}
async function getItems(req,res){
   const response=await fetchItems();
   res.send(response);
}
async function updateCartItem(req,res){
  const Data = req.body;
  const response = await updatecartItem(Data);
  res.send(response);
}
async function getItemNames(req,res){
  const response=await getItemListNames();
  res.send(response);
}
async function addStock(req,res){
  const stockData=req.body;
  const response=await addStockItem(stockData);
  res.send(response);
}
module.exports = { allUsers, verifyUsers, deleteUser, addItem,getItems,updateCartItem ,getItemNames,addStock};

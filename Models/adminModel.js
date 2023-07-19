const users=require("../Schema/credentialSchema")
const additem=require("../Schema/Item")
const Stock=require("../Schema/Stock")
const College=require("../Schema/collegeSchema")
async function getAllUsers(isVerified)
{
  
   if(isVerified=='true')
   {
    try{
      const response=await users.find({isVerified:true});
      return {success:true,message:response}
    }catch(err)
    {
      return {success:false,message:"Failed to fetch the Users,try again after sometime"}
    }
   }
   else
   {
    try{
      const response=await users.find({isVerified:false});
      return {success:true,message:response}
    }catch(err)
    {
      return {success:false,message:"Failed to fetch the Users,try again after sometime"}
    }
   }
}
async function verifySelectedUsers(userIds)
{
  console.log("heelo")
    try{
        await users.updateMany(
            { _id: { $in: userIds } }, // filter by user IDs in the given array
            { $set: { isVerified: true } } // update the isVerified field to true
          ).exec();
        return {success:true,message:"Selected users verified successfully"}
     
    }catch(err)
    {
        return {success:false,message:'internal server error'}
    }
}

async function deleteSelectedUser(userId)
{
    try{
        await users.findByIdAndDelete(userId);
        return {success:true,message:"Selected user deleted successfully"}

    }catch(err)
    {
        return {success:false,message:'internal server error'};
    }
}
async function addItems(data)
{
  try{
    const item= new additem(data);
    const response= await item.save();
    if (response) {
      return { success: true, message: "Item Added  Successfully" };
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };

  }catch(err)
  {
    return {success:false,message:'internal server error'};
  }
}
async function fetchItems()
{
  try{
    const response=await Stock.find({}).populate({
      path: 'itemRef',
      select: 'description image'
    })
    if(response)
    {
      return { success: true, message:response};
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };


  }catch(err)
  {
    return {success:false,message:'internal server error'};
  }
}
async function updatecartItem(data)
{
  const {_id,quantity}=data;
  try{
    const item = await Stock.findOne(_id);
    if (item) {
      item.quantity=quantity;
      await item.save();
      return { success: true, message: "Stock updated successfully" };

    }
      return {success:false,message:"please try again after sometime"}
    

  }catch(err)
  {
    return {success:false,message:'internal server error'};
  }
}
async function getItemListNames()
{
  try{
    const response=await additem.find().select('_id name');
    if(response)
    {
      return { success: true, message:response};
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };
  }catch(err)
  {
    return {success:false,message:'internal server error'};
  }
}
async function addStockItem(stockData){
  try{
    const {itemRef,quantity,university}=stockData
    const item = await Stock.findOne({itemRef:itemRef,university:university});
    if(item)
    {
      item.quantity=parseInt(item.quantity)+parseInt(quantity);
      await item.save();
      return { success: true, message: "Stock updated successfully" };
    }
    const stock= new Stock(stockData);
    const response= await stock.save();
    if (response) {
      return { success: true, message: "Stock Added  Successfully" };
    }
    return {
      success: false,
      message: "Something went wrong, Please try again",
    };

  }catch(err)
  {
    console.log(err);
    return {success:false,message:'internal server error'};
  }
}
async function addColleges(college)
{
  try{
    const response= new College(college);
     await  response.save()
      return { success: true, message:"college added successfully"};
    }
  catch(err)
  {
    return {success:false,message:'internal server error'};
  }
}
async function FetchColleges(){
  try{
    const response= await College.find();
      return { success: true, message:response};
    }
  catch(err)
  {
    return {success:false,message:'internal server error'};
  }
}
module.exports={getAllUsers,verifySelectedUsers,deleteSelectedUser,addItems,fetchItems,updatecartItem,getItemListNames,addStockItem,addColleges,FetchColleges};

const { getUserDeliveryExcelRefById } = require("../Models/orderModel");
const xlsx = require("xlsx");
const { UpdateExcelSheet } = require("../Utils/UpdateExcelSheetOrderHelper");
const uploadDeliveryExcelSheet=(req,res)=>{
    const excelSheetBufferData=req.file.buffer;
    const userId=req.body.userDeliveryId;
    console.log(userId)
    getUserDeliveryExcelRefById(userId).then((getExcelSheetRef)=>{
      if(!getExcelSheetRef.success)
      {
          res.send({success:false,message:"No excelSheet is found for this deliverySheet"});
      }
      else
      {
          const workbook = xlsx.read(excelSheetBufferData, { type: "buffer" });
       UpdateExcelSheet(workbook,getExcelSheetRef.message).then((response)=>{
        response=response.filter((response)=>response!=undefined);
        if(response)
        {
          res.send(response[0]);
        }
        else
        {
          res.send({success:false,message:'internal server error,try again after sometime'})
        }
       });
      
       
        
      
         
          // let workbook_response = xlsx.utils.sheet_to_json(
          //   workbook.Sheets[workbook_sheets[0]]
          // );
          // console.log(typeof workbook_response);
          // workbook_response.forEach(row => {
            
          //   });
      }
  

    });
   




}
module.exports={uploadDeliveryExcelSheet};
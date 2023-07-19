
const { getUserDeliveryExcelRefById } = require("../Models/orderModel");
const xlsx = require("xlsx");
const uploadDeliveryExcelSheet=async(req,res)=>{
    const excelSheetBufferData=req.file.buffer;
    const userId=req.body.userDeliveryId;
    const getExcelSheetRef=await getUserDeliveryExcelRefById(userId);
    if(!getExcelSheetRef.success)
    {
        res.send({success:false,message:"No excelSheet is found for this deliverySheet"});
    }
    else
    {
        const workbook = xlsx.read(excelSheetBufferData, { type: "buffer" });
        let workbook_sheets = workbook.SheetNames;
        let workbook_response = xlsx.utils.sheet_to_json(
          workbook.Sheets[workbook_sheets[0]]
        );
        console.log(typeof workbook_response);
        workbook_response.forEach(row => {
          
          });
    }





}
module.exports={uploadDeliveryExcelSheet};
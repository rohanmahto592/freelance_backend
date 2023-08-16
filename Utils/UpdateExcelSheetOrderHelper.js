const XLSX = require("xlsx");
const { UpdateOrderModelHelper } = require("./UpdateOrderModelHelper");

function UpdateExcelSheet(workbook,excelSheetRef){

    let workbook_sheetNames = workbook.SheetNames;
    return new Promise( (resolve,reject)=>{
        
        const promises= workbook_sheetNames.map(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            let AWB_NO_Data;
          
            switch (sheetName) {
              case 'Dispatched':
                AWB_NO_Data = XLSX.utils.sheet_to_json(worksheet)?.map(item =>({ 'trackingId': item['AWB NO'], 'application id': item['application id'],jsonData:item,excelSheetRef }));
                break;
          
              case 'ShipRocket_Delivery':
                AWB_NO_Data = XLSX.utils.sheet_to_json(worksheet)?.map(item => ({ 'trackingId': item['AWB NO'], 'application id': item['application id'],jsonData:item,excelSheetRef }));
                break;
          
              case 'IndianPost_Delivery':
                AWB_NO_Data = XLSX.utils.sheet_to_json(worksheet)?.map(item => ({ 'trackingId': item['AWB NO'], 'application id': item['application id'],jsonData:item,excelSheetRef }));
                break;
            }
            if (AWB_NO_Data?.length>0) {
               return (UpdateOrderModelHelper(AWB_NO_Data));
                  
              
              }
            
    })
    Promise.all(promises).then((response)=>{
        resolve(response);
    });
})
}

module.exports={UpdateExcelSheet}

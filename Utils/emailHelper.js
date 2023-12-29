const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const { Json_ExcelFile } = require("./jsonToExcelFileHelper");
const { getUserEmails } = require("../Models/adminModel");
const { sendMailViaMailJet } = require("./mailJetHelper");
async function SendExcelSheet(JsonData,docFile) {
  let adminResponse=await getUserEmails("Admin");
  adminResponse=adminResponse.message;
  let senderEmails=[];
   for(let i=0;i<adminResponse.length;i++)
   {
      senderEmails.push({Email:adminResponse[i].email,Name:adminResponse[i].name});
   }
  const ExcelsheetFileName = `proceessedExcelSheet${new Date().toString()}.xlsx`;
  const workBook=await Json_ExcelFile(JsonData);
  const buffer=XLSX.write(workBook,{type:'buffer',bookType:'xlsx'});
  const DocFile=docFile && docFile.buffer.toString("base64");
  const Messages= [
    {
      From: {
        Email: "rohanmahto592@gmail.com",
        Name: "MailJet Pilot",
      },
      To: senderEmails,
      Subject: "Processed ExcelSheet",
      HTMLPart:`<h2>Please find the attached Processed ExcelSheet.</h2>`,
      Attachments:[
        {
          "ContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Filename": ExcelsheetFileName,
          "Base64Content":buffer.toString('base64')
         },
        
      ]
    },
  ]
  if(docFile)
  {
    Messages[0].Attachments.push({"ContentType":docFile.mimetype,"Filename":docFile.originalname,"Base64Content":DocFile})
  }
  sendMailViaMailJet(Messages);
}

async function sendGuestCredentials(email, password) {
  let deliveryResponse=await getUserEmails("Delivery")
  deliveryResponse=deliveryResponse.message;
  let DeliveryEmails=[];
  for(let i=0;i<deliveryResponse.length;i++)
  {
   DeliveryEmails.push({Email:deliveryResponse[i].email,Name:deliveryResponse[i].name});
  }
 const Messages= [
    {
      From: {
        Email: "rohanmahto592@gmail.com",
        Name: "MailJet Pilot",
      },
      To: DeliveryEmails,
      Subject: "Creds for Uploading Order Sheet",
      HTMLPart:`<h2>Please find the attached user credentials for uploading the Order placed Excelsheet.</h2><h3>Email: ${email}, password: ${password}`,
    },
  ]
  sendMailViaMailJet(Messages);

}

function sendContactUsInfo({ name, email, subject, message }) {
  const UserMessage = {
    from: "rohanmahto592@gmail.com",
    to: "rskumar0402@gmail.com",
    subject: "Glimpse : User Query",
    text: `Name : ${name}, Email : ${email}, Subject : ${subject}, Message : ${message}`,
  };
  sendMail(UserMessage);
}
module.exports = { SendExcelSheet, sendGuestCredentials, sendContactUsInfo };

const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const { Json_ExcelFile } = require("./jsonToExcelFileHelper");
const { getUserEmails } = require("../Models/adminModel");
const { sendMailViaMailJet } = require("./mailJetHelper");
async function getEmailLists(type){
  let emailsResponse=await getUserEmails(type);
  emailsResponse=emailsResponse.message;
  let senderEmails=[];
   for(let i=0;i<emailsResponse.length;i++)
   {
      senderEmails.push({Email:emailsResponse[i].email,Name:emailsResponse[i].name});
   }
   return senderEmails;
}
async function SendExcelSheet(JsonData,docFile) {
  const senderEmails=await getEmailLists("Admin");
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
const DeliveryEmails=await getEmailLists("Delivery");
 const Messages= [
    {
      From: {
        Email: "rohanmahto592@gmail.com",
        Name: "MailJet Pilot",
      },
      To: DeliveryEmails,
      Subject: "Creds for Uploading Order Sheet",
      HTMLPart:`<h2>Please find the attached user credentials for uploading the Order placed Excelsheet.</h2><h3>Email: ${email}, password: ${password}</h3>Click on the given link to directly navigate to the website:<a href="https://glimpsev1.vercel.app/login">glimpse</a>`,
    },
  ]
  sendMailViaMailJet(Messages);

}

async function sendContactUsInfo({ name, email, subject, message }) {
  const senderEmails=await getEmailLists("Admin");
  const Messages= [
    {
      From: {
        Email: email,
        Name: name,
      },
      To: senderEmails,
      Subject: subject,
      TextPart:message
    },
  ]
  sendMailViaMailJet(Messages);
}
module.exports = { SendExcelSheet, sendGuestCredentials, sendContactUsInfo };

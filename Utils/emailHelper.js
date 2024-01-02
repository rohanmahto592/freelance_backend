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
async function SendExcelSheet(JsonData,docFile,fileName) {
  const senderEmails=await getEmailLists("Admin");
  const ExcelsheetFileName = `processed ${fileName}`;
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

async function sendGuestCredentials(email, password,JsonData,fileName) {
  const ExcelsheetFileName = `processed ${fileName}`;
  const workBook=await Json_ExcelFile(JsonData);
  const buffer=XLSX.write(workBook,{type:'buffer',bookType:'xlsx'});
const DeliveryEmails=await getEmailLists("Delivery");
 const Messages= [
    {
      From: {
        Email: "rohanmahto592@gmail.com",
        Name: "MailJet Pilot",
      },
      To: DeliveryEmails,
      Subject: "Excelsheet and Creds for Uploading Order Sheet",
      HTMLPart:`<h2>Please find the attached user credentials and excelsheet.</h2><h3>Email: ${email}, password: ${password}</h3>Click on the given link to directly navigate to the website:<a href="https://www.glimpse.net.in/login">glimpse</a>`,
      Attachments:[
        {
          "ContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Filename": ExcelsheetFileName,
          "Base64Content":buffer.toString('base64')
         },
        
      ]
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
async function sendResetPasswordLink(email,otp){
  const Messages=[
    {
      From:{
        Email:"rohanmahto592@gmail.com",
        Name:"mailJet Pilot"
      },
      To:[
        {
          Email:email,
          Name:email.split("@")[0],
        }
      ],
      Subject: "Reset Password Otp!!",
      HTMLPart:`<h2>Please find the attached Otp for password Reset.</h2><h3>OTP:${otp}</h3>`,

    }
  ]
  const response= await sendMailViaMailJet(Messages);
  return response;
}
module.exports = { SendExcelSheet, sendGuestCredentials, sendContactUsInfo,sendResetPasswordLink };

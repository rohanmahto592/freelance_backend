const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const { Json_ExcelFile } = require("./jsonToExcelFileHelper");
const { getUserEmails } = require("../Models/adminModel");
async function SendExcelSheet(JsonData) {
  const adminResponse=await getUserEmails("Admin");
  let senderEmails=[];
   for(let i=0;i<adminResponse.length;i++)
   {
      senderEmails.push(adminResponse[i].email);
   }
  const ExcelsheetFileName = `proceessedExcelSheet${new Date().toString()}.xlsx`;
  const message = {
    from: "rohanmahto592@gmail.com",
    to: senderEmails,
    subject: " Processed Excel file",
    attachments: [
      {
        filename: ExcelsheetFileName,
        content: XLSX.write(Json_ExcelFile(JsonData), {
          type: "buffer",
          bookType: "xlsx",
        }),
      },
    ],
  };
  sendMail(message);
}

async function sendGuestCredentials(email, password) {
  const deliveryResponse=await getUserEmails("Delivery")
  let DeliveryEmails=[];
  for(let i=0;i<deliveryResponse.length;i++)
  {
   DeliveryEmails.push(deliveryResponse[i].email);
  }
  const message = {
    from: "rohanmahto592@gmail.com",
    to: DeliveryEmails,
    subject: "User Credentials",
    text: `Email: ${email}, password: ${password}`,
  };

  sendMail(message);
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

function sendMail(message) {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.SMTP_AUTH_USERNAME,
      pass: process.env.SMTP_AUTH_PASSWORD,
    },
  });

  // Send the email
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
}
module.exports = { SendExcelSheet, sendGuestCredentials, sendContactUsInfo };

const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const { Json_ExcelFile } = require("./jsonToExcelFileHelper");
function SendExcelSheet(JsonData) {
  const ExcelsheetFileName = `proceessedExcelSheet${new Date().toString()}.xlsx`;
  const message = {
    from: "rohanmahto592@gmail.com",
    to: "rskumar0402@gmail.com",
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

function sendGuestCredentials(email, password) {
  const message = {
    from: "rohanmahto592@gmail.com",
    to: "rskumar0402@gmail.com",
    subject: "User Credentials",
    text: `Email: ${email}, password: ${password}`,
  };

  sendMail(message);
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
module.exports = { SendExcelSheet, sendGuestCredentials };

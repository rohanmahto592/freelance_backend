const mailjet = require("node-mailjet");
require("dotenv").config();
const MailJet = mailjet.connect(
  process.env.MJ_PRIVATE_KEY|| "a96bf1d27fb7320cc9659924c82507e7",
  process.env.MJ_SECRET_KEY||"f6d440d400acbcbe6955933bfe8a798e"
);

const sendMailViaMailJet = (Messages) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const request = MailJet.post("send", { version: "v3.1" }).request({
    Messages: Messages,
  });
  request
    .then((result) => {
      console.log(result.body.Messages);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports={sendMailViaMailJet}

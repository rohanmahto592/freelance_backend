const mailjet = require("node-mailjet");
const MailJet = mailjet.connect(
  process.env.MJ_PRIVATE_KEY,
  process.env.MJ_SECRET_KEY
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

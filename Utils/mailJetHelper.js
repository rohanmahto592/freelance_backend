const mailjet = require("node-mailjet");
const MailJet = mailjet.connect(
  process.env.MJ_PRIVATE_KEY,
  process.env.MJ_SECRET_KEY
);

const sendMailViaMailJet = async (Messages) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const request = MailJet.post("send", { version: "v3.1" }).request({
    Messages: Messages,
  });
const response=  request
    .then((result) => {
      return result.body.Messages[0];
    })
    .catch((err) => {
      console.log(err);
      return {Status:'Fail',message:'failed to send the email'};
    });
 return response;
};
module.exports={sendMailViaMailJet}

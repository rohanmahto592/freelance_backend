const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const option = {
  exposedHeaders: "Authorization",
};
const cron = require("node-cron");
const fs = require("fs");
const https = require("https");
const userCredentialRoute = require("./Routes/userCredentialRoutes");
const excelRoute = require("./Routes/excelRoutes");
const deliveryRoute = require("./Routes/deliveryRoutes");
const feedbackRoute = require("./Routes/feedbackRoutes");
const contactRoute = require("./Routes/contactUsRoutes");

const adminRoute = require("./Routes/adminRoutes");
const { connectDB } = require("./Db/db");
const { UpdateOrderStatus } = require("./Utils/UpdateOrderModelHelper");

app.use(express.json());
app.use(cors(option));
app.use("/api/v1", userCredentialRoute);
app.use("/api/v1", excelRoute);
app.use("/api/v1", deliveryRoute);
app.use("/api/v1", feedbackRoute);
app.use("/api/v1", adminRoute);
app.use("/api/v1", contactRoute);

cron.schedule(
  "0 1 * * *",
  () => {
    UpdateOrderStatus();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

const key = fs.readFileSync("/home/ec2-user/freelance_backend/private.key");
const cert = fs.readFileSync(
  "/home/ec2-user/freelance_backend/certificate.crt"
);

const creds = {
  key,
  cert,
};

app.get("/", (req, res) => {
  res.send("Glimpse backend");
});

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  await connectDB();
});

const httpsServer = https.createServer(creds, app);
httpsServer.listen(process.env.HTTPS_PORT);

const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const option = {
  exposedHeaders: "Authorization",
};
const cron = require("node-cron");

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

app.get(
  "/.well-known/pki-validation/4ACADDCC26DDAEFACD96E973C188DE24.txt",
  (req, res) => {
    res.sendFile(
      "/home/ec2-user/freelance_backend/4ACADDCC26DDAEFACD96E973C188DE24.txt"
    );
  }
);

app.get("/", (req, res) => {
  res.send("Glimpse backend");
});

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  await connectDB();
});

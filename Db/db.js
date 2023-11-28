const mongoose = require("mongoose");

async function connectDB() {
  try {
    const client = await mongoose.connect(process.env.MONGO_DB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to db");

    return client;
  } catch (err) {
    console.log("Error occured : ", err.message);
  }
}

module.exports = { connectDB, mongoose };

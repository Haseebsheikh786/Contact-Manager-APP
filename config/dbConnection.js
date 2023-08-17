const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNNECTION_STRING);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDb;

const mongoose = require("mongoose");
const schema = mongoose.Schema;
const dotenv=require('dotenv');
dotenv.config();
const uri = process.env.MONGODB_URL;
mongoose.connect(uri);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("data base is connected");
});
module.exports = db;

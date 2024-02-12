const mongoose = require("mongoose");
const { GlobalDatabase } = require("../controllers/connections");
GlobalDatabase.model(
  "Shop",
  new mongoose.Schema(
    {
      shopName: String,
      owner: String,
      phone: String,
      address: String,
      account: Number,
      shopKey: String,
      status: String,
      registeredBy: String,
    },
    { timestamps: true }
  )
);

const SHOPS = GlobalDatabase.model("SHOPS");

module.exports = { SHOPS };

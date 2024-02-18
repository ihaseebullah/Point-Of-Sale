const mongoose = require("mongoose");

const salesTodaySchema = new mongoose.Schema(
  {
    productName: { type: String },
    itemBarcode: String,
    productQuantity: { type: Number },
    stockRemaining: Number,
    stockPurchased: Number,
    price:Number,
    discountGiven: Number,
    buyerName: String,
  },
  { timestamps: true }
);

const SalesToday = mongoose.model("Daily Sale", salesTodaySchema);

module.exports = { SalesToday };

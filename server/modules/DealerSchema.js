const mongoose = require("mongoose");
const dealerShcema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: { type: String },
    accountNumber: String,
    totallPurchases: Number,
    account: Number,
    purchases: Array,
    amountDueTill: String,
  },
  { timestamps: true }
);

const Dealer = mongoose.model("Dealer", dealerShcema);

module.exports = Dealer;

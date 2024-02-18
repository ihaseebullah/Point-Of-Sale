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
const dealerInvoiceSchema = new mongoose.Schema({
  accountNumber:String,
  invoiceId:String,
  dealerName: String,
  dealerPhone: String,
  products: Array,
  amountPaid: String,
  totallAmount: String,
  dealerAccountNumber: String,
  debts:Number,
},{timestamps:true});

const Dealer = mongoose.model("Dealer", dealerShcema);
const DealerInvoices = mongoose.model("DealerInvoices", dealerInvoiceSchema);
module.exports = { Dealer, DealerInvoices };

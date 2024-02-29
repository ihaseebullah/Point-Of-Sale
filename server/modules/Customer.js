const mongoose = require("mongoose");
const cutomerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: String,
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    account: {
      type: Number,
      unique: false
    },
    accountNumber: { type: Number },
    assistedBy: String,
    invoices: Array,
    dueDate: String,
  },
  { timestamps: true }
);
const Customer = mongoose.model("Customer", cutomerSchema);

module.exports = { Customer };

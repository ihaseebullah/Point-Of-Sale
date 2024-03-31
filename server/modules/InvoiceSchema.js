const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    discountOffered: Number,
    address: String,
    paymentMethod: String,
    totallWithoutDiscount: Number,
    totallWithDiscount: Number,
    discountAmount: Number,
    invoiceId: String,
    orderID: String,
    customerAccount: String,
    payments: Object,
    paymentDueDate: String,
    invoiceStatus: String,
    items: Object,
    returned: { type: Boolean, default: false },
    paidAmount: { type: Number },
    amountRemaining: { type: Number, default: 0 },
    oldAccount: Number, newStyleItems: Object,
    debts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoices", invoiceSchema);

module.exports = Invoice;

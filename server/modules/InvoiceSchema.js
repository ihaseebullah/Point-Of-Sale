const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
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
    paymentDueDate: String,
    items: Object,
}, { timestamps: true })

const Invoice = new mongoose.model("Invoices", invoiceSchema)

module.exports = Invoice;
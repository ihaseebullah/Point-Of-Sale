const mongoose = require("mongoose")

const salesSchema = new mongoose.Schema({
    productsList: Object,
    salesWorth: Number,
    buyerName: String,
    discountWorth: Number,
    date: Date,
    totallWorth: Number
}, { timestamps: true })

const Sales = mongoose.model("Sale", salesSchema)

module.exports = { Sales }
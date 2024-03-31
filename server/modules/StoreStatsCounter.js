const mongoose = require('mongoose');
const statsSchema = new mongoose.Schema({
    amountInChest: { type: Number },
    amountToRecieve: Number,
    amountToPay: Number,
}, { timestamps: true })

const StoreStats = mongoose.model("StoreStats", statsSchema)

module.exports = { StoreStats }
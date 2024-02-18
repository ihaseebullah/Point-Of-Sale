const mongoose = require('mongoose');
const ProfitTrackerSchema = new mongoose.Schema({
    totallProfit: Number
}, { timestamps })

const ProfitTracker = mongoose.model('ProfitTracker', ProfitTrackerSchema)

module.exports = { ProfitTracker };
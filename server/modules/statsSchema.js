const mongoose = require("mongoose")

const statsSchema = new mongoose.Schema({
    statId:String,
    label: { type: Array, default: ['Purchases', 'Sales'] },
    dataSet: { type: Array, default: [0, 0] },
})

const Stats = mongoose.model('Stat', statsSchema)
module.exports = { Stats }
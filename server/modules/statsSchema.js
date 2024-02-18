const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
  {
    invoiceCounter: { type: Number, default: 0 },
    month: { type: Number, required: true },
    monthName: { type: String, required: true },
    returnCounter: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Stats = mongoose.model("Stats", statsSchema);

module.exports = { Stats };

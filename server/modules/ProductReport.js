const mongoose = require("mongoose");
const productReportSchema = new mongoose.Schema(
  {
    barCode: String,
    productName: String,
    profit: String,
    itemSold: { type: Number, default: 0 },
    itemReturned:{ type: Number, default:0},
    profitReturned:{ type: Number, default:0}
  },
  { timestamps: true }
);

const ProductReport = mongoose.model("ProductReport", productReportSchema);

module.exports = ProductReport;

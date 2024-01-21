const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    counter: Number,
    productName: {
      type: String,
      required: true,
    },
    category: String,
    unitPrice: {
      type: Number,
      required: true,
    },
    purchasedAmount: {
      type: Number,
      required: true,
    },
    purchasedDate: String,
    description: String,
    barCode: {
      type: String,
      sparse: true,
      required: true,
    },
    batchNo: { type: Number, required: true },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    purchasedQuantity: Number,
    dealerName: String,
    dealerPhone: Number,
    amountSold: { type: Number, default: 0 },
    returnedNumber: { type: Number, default: 0 },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

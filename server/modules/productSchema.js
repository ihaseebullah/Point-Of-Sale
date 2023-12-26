const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    counter:Number,
    productName: {
        type: String,
        required: true
    },
    category: String,
    unitPrice: {
        type: Number,
        required: true
    },
    purchasedAmount: {
        type: Number,
        required: true
    },
    purchasedDate: String,
    description: String,
    barCode: {
        type: String,
        unique: true,
        sparse: true
    },
    batchNo: { type: Number, required: true },
    stockQuantity: {
        type: Number,
        default: 0
    },
    dealerName: String,
    dealerPhone: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

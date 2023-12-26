const express = require('express');
const app = express();
const dotenv = require('dotenv').config()
const ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
mongoose.connect(process.env.CONNECTION_URL).then(() => {
    console.log("Successfully connected to the database")
})
//Mongoose Models
const Product = require('./modules/productSchema')
const Invoice = require('./modules/InvoiceSchema')
const Stats = require('./modules/statsSchema').Stats
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
app.get('/', async (req, res) => {
    const test = await Product.find({})
    res.json(test)
})
app.get('/pos', async function (req, res) {
    const products = await Product.find({})
    res.json(products)
})

app.get('/add/product', async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})

app.post('/create/invoice/incoming', async (req, res) => {
    const invoiceData = req.body;
    try {
        const newInvoice = new Invoice({
            customerName: invoiceData.customerName,
            customerPhone: invoiceData.customerPhone,
            customerEmail: invoiceData.customerEmail,
            discountOffered: parseInt(invoiceData.discount),
            address: invoiceData.address,
            paymentMethod: invoiceData.paymentMethod,
            totallWithoutDiscount: parseInt(invoiceData.totallPrice),
            totallWithDiscount: parseInt(invoiceData.discountedTotall),
            discountAmount: parseInt(invoiceData.discountAmount),
            invoiceId: invoiceData.invoiceId,
            orderID: invoiceData.orderId,
            customerAccount: invoiceData.account,
            paymentDueDate: invoiceData.paymentDueDate,
            items: invoiceData.items,
        })
        await newInvoice.save().then(() => { res.json({ message: "Invoice has been created successfully" }); })

    } catch (err) {
        res.json({ message: err.message })
    }
})


app.post('/add/product', async (req, res) => {
    console.log()
    try {
        const reqData = req.body;
        console.log(req.body)
        const newProduct = new Product({
            productName: reqData.productName,
            barCode: reqData.barCode,
            unitPrice: parseInt(reqData.unitPrice),
            purchasedAmount: parseInt(req.body.purchasedAmount),
            purchasedDate: reqData.purchasedDate,
            category: reqData.category,
            stockQuantity: parseInt(reqData.stock),
            batchNo: parseInt(reqData.batchNo),
            dealerName: reqData.dealerName,
            dealerPhone: reqData.dealerPhone,
            description: reqData.description

        })
        await newProduct.save().then(async () => {
            console.log("The data has been saved successfully")
        })
        res.json({ message: "The data has been saved successfully" })

    } catch (err) {
        console.error(err)

        res.json({ errorCode: err.code, message: "Duplication in " + Object.keys(err.keyValue) })
    }
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})
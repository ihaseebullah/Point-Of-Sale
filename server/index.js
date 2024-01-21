const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const ejs = require("ejs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
mongoose.connect(process.env.CONNECTION_URL).then(() => {
  console.log("Successfully connected to the database");
});
//Mongoose Models
const Product = require("./modules/productSchema");
const Invoice = require("./modules/InvoiceSchema");
const { SalesToday } = require("./modules/SalesToday");
const todoModal = require("./modules/TodoSchema").todoModal;
const Sales = require("./modules/salesSchema").Sales;
const Stats = require("./modules/statsSchema").Stats;

const invoiceapiController = require("./controllers/invoiceapi");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.get("/", async (req, res) => {
  const test = await Product.find({});
  res.json(test);
});
app.get("/pos", async function (req, res) {
  const products = await Product.find({});
  res.json(products);
});

app.get("/add/product", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//Invoice Making API
app.post("/create/invoice/incoming", async (req, res) => {
  invoiceapiController.invoiceapi(req, res);
});
app.get("/add/postAdditionSearchQuery/:barCode", async (req, res) => {
  let product = await Product.findOne({ barCode: req.params.barCode });
  if (product) {
    res.json({ product });
  } else {
    res.json({ message: "New Product" });
  }
});
app.post("/add/product", async (req, res) => {
  const reqData = req.body;
  const product = await Product.find({
    barCode: reqData.barCode,
  });
  const isTheProductAlreadyAvailable = await Product.findOne({
    barCode: reqData.barCode,
  });
  if (isTheProductAlreadyAvailable) {
    console.log(isTheProductAlreadyAvailable);
    try {
      const update = {
        productName: reqData.productName,
        barCode: reqData.barCode,
        unitPrice: parseInt(reqData.unitPrice),
        purchasedAmount: parseInt(req.body.purchasedAmount),
        purchasedDate: reqData.purchasedDate,
        category: reqData.category,
        stockQuantity:
          parseInt(reqData.stock) + isTheProductAlreadyAvailable.stockQuantity,
        purchasedQuantity:
          parseInt(reqData.stock) + isTheProductAlreadyAvailable.stockQuantity,
        batchNo: parseInt(reqData.batchNo),
        dealerName: reqData.dealerName,
        dealerPhone: reqData.dealerPhone,
        description: reqData.description,
      };
      await Product.findOneAndUpdate({ barCode: reqData.barCode }, update).then(
        () => {
          res.json({ message: "New stock loaded" });
        }
      );
    } catch (e) {
      res.json({ message: e.message });
    }
  } else {
    try {
      console.log(req.body);
      const newProduct = new Product({
        productName: reqData.productName,
        barCode: reqData.barCode,
        unitPrice: parseInt(reqData.unitPrice),
        purchasedAmount: parseInt(req.body.purchasedAmount),
        purchasedDate: reqData.purchasedDate,
        category: reqData.category,
        stockQuantity: parseInt(reqData.stock),
        purchasedQuantity: parseInt(reqData.stock),
        batchNo: parseInt(reqData.batchNo),
        dealerName: reqData.dealerName,
        dealerPhone: reqData.dealerPhone,
        description: reqData.description,
      });
      await newProduct.save().then(async () => {
        console.log("The data has been saved successfully");
      });
      res.json({ message: "The data has been saved successfully" });
    } catch (err) {
      console.error(err);

      res.json({
        errorCode: err.code,
        message: "Duplication in " + Object.keys(err.keyValue),
      });
    }
  }
});

app.get("/pos/sales", async (req, res) => {
  const salesData = await Sales.find({}).sort({ createdAt: -1 });
  res.json({ data: salesData });
});

app.get("/pos/sales/today", async (req, res) => {
  const salesData = await SalesToday.find({}).sort({ createdAt: -1 });
  res.json({ data: salesData });
});

app.get("/pos/topseller", async (req, res) => {
  const topseller = await Product.find({}).sort({ amountSold: -1 });
  res.json({ data: topseller });
});

app.post("/pos/dashboard/addTodo", async (req, res) => {
  const newTodo = new todoModal({
    title: req.body.todo,
  });
  await newTodo.save().then(async () => {
    const data = await todoModal.find({});
    res.json({ data: data });
  });
});
app.get("/pos/dashboard/addTodo", async (req, res) => {
  const data = await todoModal.find({});
  res.json({ data: data });
});
app.delete("/pos/dashboard/todo/delete/:id", async (req, res) => {
  await todoModal.findByIdAndDelete(req.params.id).then(async () => {
    const data = await todoModal.find({});
    res.json({ data: data });
  });
});
app.get("/pos/dashboard/getUsers", async (req, res) => {
  const user = await Invoice.find({});
  res.json({ data: user });
});
app.get("/pos/inventory", async (req, res) => {
  const inventory = await Product.find({});
  res.json({ data: inventory });
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});

const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const ejs = require("ejs");
const cors = require("cors");
const cookie = require("cookie-parser");

const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
//Authentication and Security
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");
const User = require("./modules/User").User;
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

//Controllers
const invoiceapiController = require("./controllers/invoiceapi");
const reurnedInvoiceController = require("./controllers/returnedinvoiceapi");

//Authentication
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookie());

app.set("view engine", "ejs");
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", async (req, res) => {
  const test = await Product.find({});
  const token = req.cookies?.jwt;
  try {
    jwt.verify(token, process.env.SECRET_SESSION_KEY, {}, (err, user) => {
      if (err) throw err;
      res.json({ user, statusCode: 400 });
    });
  } catch (err) {
    res.json({ message: err.message, statusCode: 403 });
  }
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
app.post("/create/invoice/returned", async (req, res) => {
  reurnedInvoiceController.returnedinvoiceapi(req, res);
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
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const salesData = await SalesToday.find({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).sort({ createdAt: -1 });

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
app.get("/pos/dashboard/getInvoices", async (req, res) => {
  const user = await Invoice.find({}).sort({ createdAt: -1 });
  res.json({ data: user });
});
app.get("/pos/dashboard/locations", async (req, res) => {
  const data = await Invoice.find({}).sort({ createdAt: -1 });
  res.json({ data: data });
});
app.get("/pos/inventory", async (req, res) => {
  const inventory = await Product.find({});
  res.json({ data: inventory });
});
app.get("/stats", async (req, res) => {
  const stats = await Stats.find({});
  res.json({ data: stats });
});
app.get("/pos/dasboard/invoice/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.json({ data: invoice });
});
app.get("/pos/dashboard/info", async (req, res) => {
  const inventory = await Product.find({});
  const invoices = await Invoice.find({});
  const mail = "8 Mails";
  res.json({ data: { inventory: inventory, invoices: invoices, mails: mail } });
});
app.get("/products", async (req, res) => {
  res.json({ data: await Product.find({}) });
});
app.post("/signup", async (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    address,
    city,
    state,
    country,
    registeredBy,
    role,
  } = req.body;
  const newUer = new User({
    username,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    address,
    city,
    state,
    country,
    registeredBy,
    role,
    password,
  });
  User.register(newUer, password, (err, user) => {
    if (err) {
      res.json({ message: err.message }).status(401);
    } else {
      passport.authenticate("local")(req, res, () => {
        jwt.sign(
          { name: user.username, id: user._id },
          process.env.SECRET_SESSION_KEY,
          {},
          (err, token) => {
            if (err) {
              res.json({ message: err.message, status: 403 });
            } else {
              res
                .cookie("jwt", token, {
                  expires: new Date(Date.now() + 600000),
                  httpOnly: true,
                })
                .json({
                  message: `${user.firstName} ${user.lastName} has been registered as ${user.role}`,
                  status: 200,
                })
                .status(200);
            }
          }
        );
      });
    }
  });
});
app.post("/signin", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    try {
      if (err) {
        return res.json({ message: err.message, statusCode: 500 });
      }

      if (!user) {
        // Customize the error message based on the info object
        let errorMessage = "Authentication failed.";

        if (info && info.message) {
          errorMessage = info.message;
        }

        return res.json({ message: errorMessage, statusCode: 403 });
      }

      jwt.sign(
        { user },
        process.env.SECRET_SESSION_KEY,
        {},
        (jwtErr, token) => {
          if (jwtErr) {
            return res.json({ message: jwtErr.message, statusCode: 403 });
          }

          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true,
          });

          return res.json({
            message: "Success Message",
            user,
            statusCode: 200,
          });
        }
      );
    } catch (error) {
      return res.json({ message: error.message, statusCode: 500 });
    }
  })(req, res, next);
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});

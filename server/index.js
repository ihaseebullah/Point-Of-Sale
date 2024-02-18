const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const ejs = require("ejs");
const cors = require("cors");
const cookie = require("cookie-parser");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
//Authentication and Security
const session = require("express-session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = bcrypt.genSaltSync(10);
const User = require("./modules/User").User;

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
const { Customer } = require("./modules/Customer");
const addProductController = require("./controllers/addProduct");
const Dealer = require("./modules/DealerSchema").Dealer;
const ProductReport = require("./modules/ProductReport");
const authenticationController = require("./controllers/securityController");
const { Expense } = require("./modules/ExpenseSchema");
const { DealerInvoices } = require("./modules/DealerSchema");
//Authentication
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    saveUninitialized: true,
    resave: true,
    maxAge: 2 * 60 * 1000,
  })
);
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

app.get("/authenticateTheConnection/:key", async (req, res) => {
  const key = req.params.key;
  authenticationController.authenticateTheConnection(req, res, key);
});
app.get("/", loginUser, async (req, res) => {
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
app.get("/pos", loginUser, async function (req, res) {
  const products = await Product.find({});
  res.json(products);
});

app.get("/add/product", loginUser, async (req, res) => {
  const dealers = await Dealer.find({});
  res.json(dealers);
});

//Invoice Making API
app.post("/create/invoice/incoming", loginUser, async (req, res) => {
  invoiceapiController.invoiceapi(req, res);
});
app.post("/create/invoice/returned", loginUser, async (req, res) => {
  reurnedInvoiceController.returnedinvoiceapi(req, res);
});
app.get(
  "/add/postAdditionSearchQuery/:barCode",
  loginUser,
  async (req, res) => {
    let product = await Product.findOne({ barCode: req.params.barCode });
    if (product) {
      res.json({ product });
    } else {
      res.json({ message: "New Product" });
    }
  }
);
app.post("/add/product", loginUser, async (req, res) => {
  addProductController.addProduct(req, res);
});

app.get("/pos/sales", loginUser, async (req, res) => {
  const salesData = await Sales.find({}).sort({ createdAt: -1 });
  res.json({ data: salesData });
});

app.get("/pos/sales/today", loginUser, async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const salesData = await SalesToday.find({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).sort({ createdAt: -1 });
  const sales = await SalesToday.find({});
  res.json({ data: salesData, sales });
});

app.get("/pos/topseller", loginUser, async (req, res) => {
  const topseller = await Product.find({}).sort({ amountSold: -1 });
  res.json({ data: topseller });
});

app.post("/pos/dashboard/addTodo", loginUser, async (req, res) => {
  const newTodo = new todoModal({
    title: req.body.todo,
  });
  await newTodo.save().then(async () => {
    const data = await todoModal.find({});
    res.json({ data: data });
  });
});
app.get("/pos/dashboard/addTodo", loginUser, async (req, res) => {
  const data = await todoModal.find({});
  res.json({ data: data });
});
app.delete("/pos/dashboard/todo/delete/:id", loginUser, async (req, res) => {
  await todoModal.findByIdAndDelete(req.params.id).then(async () => {
    const data = await todoModal.find({});
    res.json({ data: data });
  });
});
app.get("/pos/dashboard/getInvoices", loginUser, async (req, res) => {
  const user = await Invoice.find({}).sort({ createdAt: -1 });
  res.json({ data: user });
});
app.get("/pos/dashboard/locations", loginUser, async (req, res) => {
  const data = await Invoice.find({}).sort({ createdAt: -1 });
  res.json({ data: data });
});
app.get("/pos/inventory", loginUser, async (req, res) => {
  const inventory = await Product.find({});
  res.json({ data: inventory });
});
app.get("/stats", loginUser, async (req, res) => {
  const stats = await Stats.find({});
  res.json({ data: stats });
});
app.get("/pos/dasboard/invoice/:id", loginUser, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.json({ data: invoice });
});
app.get("/pos/dashboard/info", loginUser, async (req, res) => {
  const inventory = await Product.find({});
  const invoices = await Invoice.find({});
  const dealers = await Dealer.find({});
  const profit = await ProductReport.find({});
  const myExpenditure = await Expense.find({});
  const mail = "8 Mails";
  res.json({
    data: {
      inventory: inventory,
      invoices: invoices,
      mails: mail,
      dealers: dealers,
      profit,
      expenses: myExpenditure,
    },
  });
});
app.get("/products", loginUser, async (req, res) => {
  res.json({ data: await Product.find({}) });
});
app.post("/signup", loginUser, async (req, res) => {
  try {
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
    const newUser = new User({
      username,
      password: bcrypt.hashSync(password, saltRounds),
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
    });
    await newUser.save().then(() => {
      req.session.User = newUser;
      res.json({ message: "New User Created", statusCode: 200, newUser });
    });
  } catch (e) {
    res.json({ message: e.message, statusCode: 500 });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.User = user;
        jwt.sign({ user }, process.env.SECRET_SESSION_KEY, {}, (err, token) => {
          res
            .cookie("jwt", token, {
              maxAge: 2 * 60 * 60 * 1000,
              httpOnly: true,
            })
            .json({ message: "Login Successfull", statusCode: 200, user });
        });
      } else {
        res.json({ message: "Invalid Password", statusCode: 400 });
      }
    } else {
      res.json({ message: "Invalid Username", statusCode: 400 });
    }
  } catch (e) {
    res.json({ message: e.message, statusCode: 500 });
  }
});
function loginUser(req, res, next) {
  if (!req.session.user) {
    const token = req.cookies?.jwt;
    if (token) {
      try {
        jwt.verify(token, process.env.SECRET_SESSION_KEY, {}, (err, user) => {
          if (err) throw err;
          req.session.User = user.user;
        });
        next();
      } catch (err) {
        res.json({ message: err.message, statusCode: 403 });
      }
      return;
    } else {
      res.json({ message: "Please Login First", statusCode: 4001 });
    }
  }
}
app.post("/accounts/me/changePassword", loginUser, async function (req, res) {
  try {
    const { currentPasword, newPassword } = req.body;
    const user = await User.findById(req.session.User._id);
    console.log(user);
    if (bcrypt.compareSync(currentPasword, user.password)) {
      user.password = bcrypt.hashSync(newPassword, saltRounds);
      await user.save();
      const updateDataForPasswordChange = {
        lastPasswordUpdated: new Date(),
      };
      await User.findByIdAndUpdate(
        req.session.User._id,
        updateDataForPasswordChange
      );
      res.clearCookie("jwt");
      req.session.destroy();

      res.json({ message: "Password Changed Successfully", statusCode: 200 });
    } else {
      res.json({ message: "Invalid Old Password", statusCode: 400 });
    }
  } catch (e) {
    res.json({ message: e.message, statusCode: 500 });
  }
});

app.post("/api/user/checkOldPassword/:id", loginUser, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.params.id);
    if (bcrypt.compareSync(req.body.currentPasword, user.password)) {
      res.json({ message: "Old Password Correct", statusCode: 200 });
    } else {
      res.json({ message: "Old Password Incorrect", statusCode: 400 });
    }
  } catch (e) {
    res.json({ message: e.message, statusCode: 500 });
  }
});
app.post("/accounts/me/update", loginUser, async (req, res) => {
  try {
    const update = req.body;
    const updatedData = await User.findByIdAndUpdate(
      req.session.User._id,
      update
    );
    res.clearCookie("jwt");
    req.session.destroy();
    res.json({ user: updatedData, statusCode: 200 });
  } catch (e) {
    res.json({ message: e.message, statusCode: 500 });
  }
});
app.get("/account/me/delete/:id", loginUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("jwt");
    req.session.destroy();
    res.json({ message: "User Deleted Successfully", statusCode: 200 });
  } catch (e) {
    res.json({ message: "User Deleted Error", statusCode: 500 });
  }
});

app.post("/updateProfileImage/", loginUser, async (req, res) => {
  const imageData = req.body;
  await User.findByIdAndUpdate(req.session.User._id, {
    img: imageData.img,
  });
  const user = await User.findById(req.session.User._id);
  res.clearCookie("jwt");
  req.session.destroy();
  res.json({
    user: user,
    statusCode: 200,
  });
});
app.post("/api/pos/expenses", async function (req, res) {
  const reqData = req.body;
  console.log(reqData);
  try {
    const newExpense = new Expense({
      expenseName: reqData.expenseName,
      amount: parseInt(req.body.amount),
      purpose: reqData.purpose,
      by: req.session.User.firstName + " " + req.session.User.lastName,
    });
    newExpense.save();
    res.json({ message: "Spending counted", statusCode: 200, newExpense });
  } catch (e) {
    res.json({ message: e.message, statusCode: 500 });
  }
});

app.get("/api/pos/expenses", async function (req, res) {
  const expenseData = await Expense.find({});
  res.json({ expenseData, message: "Got the data" });
});
app.get("/admin/accounts/manage", async function (req, res) {
  const allUsers = await User.find({});
  res.json({ allUsers });
});
app.post("/admin/accounts/change-role/:id", async (req, res) => {
  console.log(req.body);
  await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
  const updatedUsers = await User.find({}).sort({ createdAt: 1 });
  res.json({ allUsers: updatedUsers, statusCode: 200 });
});
app.post("/admin/accounts/block-role/:id", async (req, res) => {
  console.log(req.body);
  const oldStatus = await User.findById(req.params.id);
  await User.findByIdAndUpdate(req.params.id, {
    status: oldStatus.status === "Blocked" ? "Active" : "Blocked",
  });
  const updatedUsers = await User.find({}).sort({ createdAt: 1 });
  res.json({ allUsers: updatedUsers, statusCode: 200 });
});
app.get("/logout", async (req, res) => {
  res.clearCookie("jwt");
  req.session.destroy();
  res.json({ message: "Logged Out Successfully", statusCode: 200 });
});
app.get("/updateUser", loginUser, async (req, res) => {
  if (req.session.User) {
    const user = await User.findById(req.session.User._id);
    res.json({ user: user, statusCode: 200 });
  }
});
app.get("/clients", async (req, res) => {
  const clients = await Customer.find({});
  res.json({ clients, statusCode: 200 });
});
app.get("/customer/account/:name", async (req, res) => {
  const accounts = await Customer.find({ customerName: req.params.name });
  res.json({ accounts, statusCode: 200 });
});
app.get("/customer/:account", async (req, res) => {
  const details = await Customer.findOne({ accountNumber: req.params.account });
  res.json({ details, statusCode: 200 });
});
app.get("/profit", async (req, res) => {
  const profit = await ProductReport.find({});
  res.json({ profit: profit });
});

app.get("/api/pos/get/account/:name", async (req, res) => {
  const accounts = await Dealer.find({ name: req.params.name });
  res.json({ accounts: accounts });
});
app.get('/pos/suppliers/get/invoces/:id', async (req, res) => {
  const invoices = await DealerInvoices.find({ accountNumber: req.params.id })
  res.json(invoices).status(200);
})
app.listen(3000, () => {
  console.log("listening on port 3000");
});

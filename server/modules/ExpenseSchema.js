const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    expenseName: String,
    amount: Number,
    expenseDate: String,
    by: String,
    purpose: String,
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = { Expense };

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    username: { type: String, unique: true },
    password: String,
    phone: Number,
    dob: String,
    gender: String,
    address: String,
    city: String,
    state: String,
    country: String,
    registeredBy: String,
    role: String,
    sales: { type: Number, default: 0 },
    img: String,
    email: String,
    registeredRoles: { type: Number, default: 0 },
    invoicesCreated: { type: Number, default: 0 },
    lastPasswordUpdated: String,
    lastInfoEdited: String,
    access: Array,
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = { User };

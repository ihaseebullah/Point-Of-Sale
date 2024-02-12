const mongoose = require("mongoose");

const GlobalDatabase = mongoose.createConnection(process.env.CONNECTION_URL_2);
mongoose.connect(process.env.CONNECTION_URL).then(() => {
  console.log("Successfully connected to the database");
});

module.exports = { GlobalDatabase };

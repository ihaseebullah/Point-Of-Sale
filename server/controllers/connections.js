const mongoose = require("mongoose");

const GlobalDatabase = mongoose.createConnection(process.env.LOCAL_DATABASE_SC);
mongoose.connect(process.env.LOCAL_DATABASE).then(() => {
  console.log("Successfully connected to the database");
});

module.exports = { GlobalDatabase };

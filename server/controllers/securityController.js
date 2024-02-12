const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = bcrypt.genSaltSync(10);
const { GlobalDatabase } = require("./connections");
GlobalDatabase.model(
  "SHOPS",
  new mongoose.Schema(
    {
      shopKey: String,
      owner: String,
      address: String,
      id: String,
      dues: Number,
      deployedBy: String,
      dateOfDeployment: String,
      status: String,
    },
    { timestamps: true }
  )
);
const SHOPS = GlobalDatabase.model("SHOPS");
async function authenticateTheConnection(req, res, key) {
  try {
    const dbKeys = await SHOPS.findOne({ id: key });
    const auth = bcrypt.compareSync(key, dbKeys.shopKey);
    if (auth) {
      if (dbKeys.status === "Blocked") {
        res.json({ key: key, statusCode: 5000 });
      } else {
        res.json({ key: key, statusCode: 2000 });
      }
    } else {
      res.json({ message: "Modification Detected" });
    }
  } catch (err) {
    res.json({ msessage: err.message, statusCode: 3000 });
    console.log(err);
  }
}

async function authenticateNewConnection() {
  const GlobalDatabase = mongoose.createConnection(
    process.env.CONNECTION_URL_2
  );
  GlobalDatabase.model(
    "Keys",
    new mongoose.Schema({ key: { type: String, required: true } })
  );
  const KEY = GlobalDatabase.model("Keys");
}

module.exports = {
  authenticateNewConnection,
  authenticateTheConnection,
  GlobalDatabase,
  SHOPS,
};

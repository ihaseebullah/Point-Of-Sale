const Dealer = require("../modules/DealerSchema");
const Product = require("../modules/productSchema");

async function addProduct(req, res) {
  try {
    const reqData = req.body;

    // Check if the product already exists
    const isTheProductAlreadyAvailable = await Product.findOne({
      barCode: reqData.barCode,
    });

    if (isTheProductAlreadyAvailable) {
      // If the product exists, update its details
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
        purchasedPrice: reqData.purchasedPrice,
        dealerAccountNumber: reqData.dealerAccountNumber,
        profit: calculateProfit(reqData.unitPrice, reqData.purchasedPrice),
        expirayDate: reqData.expirayDate,
      };

      await Product.findOneAndUpdate({ barCode: reqData.barCode }, update);
    } else {
      // If the product doesn't exist, create a new product
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
        dealerAccountNumber: reqData.dealerAccountNumber,
        dealerName: reqData.dealerName,
        dealerPhone: reqData.dealerPhone,
        description: reqData.description,
        purchasedPrice: reqData.purchasedPrice,
        profit: calculateProfit(reqData.unitPrice, reqData.purchasedPrice),
        expirayDate: reqData.expirayDate,
      });

      await newProduct.save();
    }

    // Update or create the dealer
    const dealer = await Dealer.findOne({
      accountNumber: reqData.dealerAccountNumber,
    });
    const object = {
      barCode: reqData.barCode,
      productName: reqData.productName,
      stock: reqData.stock,
      amountPaid: reqData.amountPaid,
      amountRemaining:
        reqData.purchasedPrice * reqData.stock - reqData.amountPaid,
      date: new Date().toLocaleDateString("en-Us", { dateStyle: "full" }),
    };
    if (!dealer) {
      const newDealer = new Dealer({
        accountNumber: reqData.dealerAccountNumber,
        name: reqData.dealerName,
        phone: reqData.dealerPhone,
        purchases: [object],
        totallPurchases: parseInt(req.body.purchasedAmount),
        account:
          parseInt(reqData.purchasedAmount) - parseInt(reqData.amountPaid),
        amountDueTill: reqData.amountDueTill,
        amountDueTill: reqData.amountDueTill,
      });

      await newDealer.save();
    } else {
      let objectAvaliable = dealer.purchases;
      objectAvaliable.push(object);
      const dealerUpdate = {
        accountNumber: reqData.accountNumber,
        name: reqData.dealerName,
        totallPurchases: dealer.totallPurchases
          ? dealer.totallPurchases + parseInt(req.body.purchasedAmount)
          : parseInt(req.body.purchasedAmount),
        purchases: objectAvaliable,
        phone: reqData.dealerPhone,
        account:
          parseInt(dealer.account) +
          parseInt(req.body.purchasedAmount) -
          parseInt(reqData.amountPaid),
        amountDueTill: reqData.amountDueTill,
      };

      await Dealer.findOneAndUpdate(
        { accountNumber: reqData.dealerAccountNumber },
        dealerUpdate
      );
    }

    res.json({ message: "Operation successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: err.code, message: err.message });
  }
}

function calculateProfit(unitPrice, purchasedPrice) {
  return (
    ((parseInt(unitPrice) - parseInt(purchasedPrice)) /
      parseInt(purchasedPrice)) *
    100
  );
}

function calculateDealerAccount(currentAccount, purchasedAmount, amountPaid) {
  return currentAccount + parseInt(purchasedAmount) - parseInt(amountPaid);
}

module.exports = { addProduct };

const Dealer = require("../modules/DealerSchema").Dealer;
const DealerInvoices = require("../modules/DealerSchema").DealerInvoices;
const Product = require("../modules/productSchema");

async function dealersEnrollmentAndUpdationSystem(req, res) {
  let invoiceId = Math.random()
  const dealer = await Dealer.findOne({
    accountNumber: req.body.dealerAccountNumber,
  });
  if (dealer) {
    console.log((dealer.totallPurchases ? parseInt(dealer.totallPurchases) : 0))
    let update = {
      purchases: [...dealer.purchases, invoiceId],
      totallPurchases: (dealer.totallPurchases ? parseInt(dealer.totallPurchases) : 0) + parseInt(req.body.totallAmount),
      account:
        parseInt(req.body.totallAmount) -
        parseInt(req.body.amountPaid) +
        parseInt(dealer.account),
    };
    await Dealer.findOneAndUpdate(
      { accountNumber: req.body.dealerAccountNumber },
      update
    );
    const newDealerInvoice = new DealerInvoices({ ...req.body, invoiceId, accountNumber: dealer.accountNumber, debts: parseInt(dealer.account) });
    await newDealerInvoice.save();
  } else {
    const newDealer = new Dealer({
      purchases: [invoiceId],
      name: req.body.dealerName,
      totallPurchases: req.body.totallAmount,
      phone: req.body.dealerPhone,
      accountNumber: Math.floor(Math.random() * 3621736),
      account: parseInt(req.body.totallAmount) - parseInt(req.body.amountPaid),
    });
    await newDealer.save();
    const newDealerInvoice = new DealerInvoices({ ...req.body, invoiceId, accountNumber: newDealer.accountNumber, debts: 0 });
    await newDealerInvoice.save()
  }
}
async function addProduct(req, res) {
  const products = req.body.products.length;
  dealersEnrollmentAndUpdationSystem(req);
  try {
    for (let i = 0; i < products; i++) {
      const reqData = req.body;
      // Check if the product already exists
      const isTheProductAlreadyAvailable = await Product.findOne({
        barCode: reqData.products[i].barCode,
      });

      if (isTheProductAlreadyAvailable) {
        // If the product exists, update its details
        const update = {
          productName: reqData.products[i].productName,
          barCode: reqData.products[i].barCode,
          unitPrice: parseInt(reqData.products[i].unitPrice),
          purchasedDate: new Date().toLocaleDateString(),
          category: reqData.products[i].category,
          stockQuantity:
            parseInt(reqData.products[i].stock) +
            isTheProductAlreadyAvailable.stockQuantity,
          purchasedQuantity:
            parseInt(reqData.products[i].stock) +
            isTheProductAlreadyAvailable.stockQuantity,
          batchNo: parseInt(reqData.products[i].batchNo),
          dealerName: reqData.dealerName,
          dealerPhone: reqData.dealerPhone,
          purchasedPrice: reqData.products[i].purchasedPrice,
          dealerAccountNumber: reqData.dealerAccountNumber,
          profit: calculateProfit(
            reqData.products[i].unitPrice,
            reqData.products[i].purchasedPrice
          ),
          expirayDate: reqData.products[i].expirayDate,
        };

        await Product.findOneAndUpdate(
          { barCode: reqData.products[i].barCode },
          update
        );
      } else {
        // If the product doesn't exist, create a new product
        const newProduct = new Product({
          productName: reqData.products[i].productName,
          barCode: reqData.products[i].barCode,
          unitPrice: parseInt(reqData.products[i].unitPrice),
          purchasedAmount: parseInt(reqData.totallAmount),
          purchasedDate: reqData.purchasedDate,
          category: reqData.products[i].category,
          stockQuantity: parseInt(reqData.products[i].stock),
          purchasedQuantity: parseInt(reqData.products[i].stock),
          batchNo: parseInt(reqData.products[i].batchNo),
          dealerAccountNumber: reqData.dealerAccountNumber,
          dealerName: reqData.dealerName,
          dealerPhone: reqData.dealerPhone,
          description: reqData.description,
          purchasedPrice: reqData.products[i].purchasedPrice,
          profit: calculateProfit(
            reqData.products[i].unitPrice,
            reqData.products[i].purchasedPrice
          ),
          expirayDate: reqData.products[i].expirayDate,
        });

        await newProduct.save();
      }
    }
    res.json({ message: "Operation successful" });
  } catch (err) {
    res.json({ statusCode: err.code, message: err.message });
  }
}

function calculateProfit(unitPrice, purchasedPrice) {
  return (
    ((parseInt(unitPrice) - parseInt(purchasedPrice)) /
      parseInt(purchasedPrice)) *
    100
  );
}

module.exports = { addProduct };

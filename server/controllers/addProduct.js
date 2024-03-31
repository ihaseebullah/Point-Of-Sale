const Dealer = require("../modules/DealerSchema").Dealer;
const DealerInvoices = require("../modules/DealerSchema").DealerInvoices;
const Product = require("../modules/productSchema");

async function dealersEnrollmentAndUpdationSystem(req, res) {
  let invoiceId = Math.random()
  const dealer = await Dealer.findOne({
    accountNumber: req.body.accountNumber,
  });
  if (dealer) {
    console.log((dealer.totallPurchases ? parseInt(dealer.totallPurchases) : 0))
    let update = {
      purchases: [...dealer.purchases, invoiceId],
      totallPurchases: (dealer.totallPurchases ? parseInt(dealer.totallPurchases) : 0) + (parseInt(req.body.subtotal) - parseInt(req.body.lumpDiscount)),
      account:
        (parseInt(req.body.subtotal) - parseInt(req.body.amountPaid)) - parseInt(req.body.lumpDiscount) +
        parseInt(dealer.account),
    };
    await Dealer.findOneAndUpdate(
      { accountNumber: req.body.accountNumber },
      update
    );
    const newDealerInvoice = new DealerInvoices({ ...req.body, invoiceId, accountNumber: dealer.accountNumber, debts: parseInt(dealer.account) });
    await newDealerInvoice.save();
    console.log("Old Dealer")

  } else {
    const newDealer = new Dealer({
      purchases: [invoiceId],
      name: req.body.name,
      totallPurchases: parseInt(req.body.subtotal),
      phone: req.body.dealerPhone,
      accountNumber: Math.floor(Math.random() * 3621736),
      account: (parseInt(req.body.subtotal) - parseInt(req.body.amountPaid)) - parseInt(req.body.lumpDiscount),
    });
    await newDealer.save();
    const newDealerInvoice = new DealerInvoices({ ...req.body, invoiceId, accountNumber: newDealer.accountNumber, debts: 0 });
    await newDealerInvoice.save()
    console.log("New Dealer")
  }
}
async function addProduct(req, res) {
  const products = req.body.products.length;
  dealersEnrollmentAndUpdationSystem(req);
  try {
    for (let i = 0; i < products; i++) {
      const reqData = req.body;
      const unitPrice = parseInt(reqData.products[i].purchasedPrice) + parseInt(reqData.products[i].profitMargin);
      // Check if the product already exists
      const isTheProductAlreadyAvailable = await Product.findOne({
        barCode: reqData.products[i].barCode,
      });

      if (isTheProductAlreadyAvailable) {
        // If the product exists, update its details
        const update = {
          productName: reqData.products[i].productName,
          barCode: reqData.products[i].barCode,
          unitPrice: unitPrice,
          purchasedDate: new Date().toLocaleDateString(),
          category: reqData.products[i].category,
          stockQuantity:
            parseInt(reqData.products[i].stockPurchased) +
            isTheProductAlreadyAvailable.stockQuantity,
          purchasedQuantity:
            parseInt(reqData.products[i].stockPurchased),
          batchNo: isTheProductAlreadyAvailable.batchNo ? isTheProductAlreadyAvailable.batchNo + 1 : 1,
          dealerName: reqData.name,
          dealerPhone: reqData.dealerPhone,
          purchasedPrice: reqData.products[i].purchasedPrice,
          dealerAccountNumber: reqData.dealerAccountNumber,
          profit: calculateProfit(
            reqData.products[i].unitPrice,
            reqData.products[i].purchasedPrice
          ),
          // expirayDate: reqData.products[i].expirayDate,
        };

        await Product.findOneAndUpdate(
          { barCode: reqData.products[i].barCode },
          update
        );
      } else {
        // If the product doesn't exist, create a new product
        res.json({ message: "404 Item Not Fount", statusCode: 404 });
      }
    }
    res.json({ message: "Operation successful" ,statusCode: 200 });
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

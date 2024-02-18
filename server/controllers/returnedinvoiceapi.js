const { Customer } = require("../modules/Customer");
const Invoice = require("../modules/InvoiceSchema");
const ProductReport = require("../modules/ProductReport");
const { SalesToday } = require("../modules/SalesToday");
const { todoModal } = require("../modules/TodoSchema");
const Product = require("../modules/productSchema");
const { Sales } = require("../modules/salesSchema");
const { Stats } = require("../modules/statsSchema");

async function returnedinvoiceapi(req, res) {
  const returnData = req.body;
  try {
    const newReturn = new Invoice({
      customerName: returnData.customerName,
      customerPhone: returnData.customerPhone,
      customerEmail: returnData.customerEmail,
      discountOffered: parseInt(returnData.discount),
      address: returnData.address,
      paymentMethod: returnData.paymentMethod,
      totallWithoutDiscount: parseInt(returnData.totallPrice),
      totallWithDiscount: parseInt(returnData.discountedTotall2),
      discountAmount: parseInt(returnData.discountAmount),
      invoiceId: returnData.invoiceId,
      orderID: returnData.orderId,
      customerAccount: returnData.account,
      paymentDueDate: returnData.paymentDueDate,
      items: returnData.items,
      returned: true,
      debts: returnData.debts,
      paidAmount: returnData.paidAmount,
      amountRemaining: returnData.amountRemaining,
    });

    await newReturn.save().then(() => {
      Object.keys(returnData.items).forEach(async (barcode) => {
        const product = await Product.findOne({ barCode: barcode })
        const productReport = await ProductReport.findOne({ barCode: barcode })
        const updateProductReport = {
          itemReturned: productReport.itemReturned + parseInt(returnData.items[barcode]),
          profit: productReport.profit - ((product.unitPrice - product.purchasedPrice) * returnData.items[barcode]),
          profitReturned: ((product.unitPrice - product.purchasedPrice) * returnData.items[barcode]) + productReport.profitReturned
        }
        await ProductReport.findOneAndUpdate({ barCode: barcode }, updateProductReport)
      })
    });

    // Update product quantities and related data for each returned item
    for (const itemBarcode in returnData.items) {
      const returnedQuantity = parseInt(returnData.items[itemBarcode]);

      // Find the product based on the barcode
      const targetProduct = await Product.findOne({ barCode: itemBarcode });

      // Update stock and other related data
      const update = {
        stockQuantity: targetProduct.stockQuantity + returnedQuantity,
        amountSold: targetProduct.amountSold - returnedQuantity,
      };
      await Product.findOneAndUpdate({ barCode: itemBarcode }, update);
      // Update daily sales for returned items
      const dailySales = new SalesToday({
        productName: targetProduct.productName,
        itemBarcode: targetProduct.barCode,
        stockPurchased: -returnedQuantity, // Negative value for returns
        price: targetProduct.unitPrice,
        productQuantity: returnedQuantity,
        stockRemaining: update.stockQuantity,
        discountGiven: returnData.discount,
        buyerName: returnData.customerName,
      });
      await dailySales.save();
    }

    // Create a new sales record for the return
    const newReturnSale = new Sales({
      productsList: returnData.items,
      discountWorth: returnData.discountAmount,
      date: new Date(),
      buyerName: returnData.customerName,
      totallWorth: -parseInt(returnData.discountedTotall2), // Negative value for returns
    });

    await newReturnSale.save();
    const userFound = await Customer.findOne({
      accountNumber: returnData.account,
    });
    const invId = await Invoice.find({}).sort({ createdAt: -1 }).limit(1);
    if (
      userFound ? userFound.accountNumber : userFound === returnData.account
    ) {
      console.log(userFound);
      const update = {
        invoices: [...userFound.invoices, invId[0]._id],
        account:
          parseInt(userFound.account) -
          (parseInt(returnData.discountedTotall2) -
            parseInt(returnData.paidAmount)),
        dueDate: returnData.paymentDueDate,
        assistedBy:
          req.session.User.firstName + " " + req.session.User.lastName,
      };
      await Customer.findOneAndUpdate(
        { accountNumber: returnData.account },
        update
      );
    } else {
      console.log(returnData);
      const newCustomer = new Customer({
        customerName: returnData.customerName,
        customerPhone: returnData.customerPhone,
        customerEmail: returnData.customerEmail,
        address: returnData.address,
        paymentMethod: returnData.paymentMethod,
        amountRemaining: returnData.amountRemaining,
        account: returnData.discountedTotall2 - returnData.paidAmount,
        accountNumber: returnData.account,
        invoices: invId[0]._id,
        assistedBy:
          req.session.User.firstName + " " + req.session.User.lastName,
        dueDate: returnData.paymentDueDate,
      });
      await newCustomer.save();
    }
    // Update stats for returns
    const areStatsAvailable = await Stats.findOne({
      month: new Date().getMonth(),
    });
    if (areStatsAvailable) {
      const statUpdate = {
        invoiceCounter: parseInt(areStatsAvailable.invoiceCounter) + 1,
      };

      await Stats.findOneAndUpdate(
        { month: new Date().getMonth() },
        statUpdate
      );

      console.log("Stats updated for returns", statUpdate);
    } else {
      const newStat = new Stats({
        month: new Date().getMonth(),
        monthName: new Date().toLocaleString("default", {
          month: "long",
        }),
        invoiceCounter: 1,
      });

      await newStat.save();
      console.log("New Stats Created for returns", newStat);
    }

    res.json({ message: "Products returned successfully" });
  } catch (err) {
    console.error("Error handling product return:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { returnedinvoiceapi };

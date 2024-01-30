const Invoice = require("../modules/InvoiceSchema");
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
      totallWithDiscount: parseInt(returnData.discountedTotall),
      discountAmount: parseInt(returnData.discountAmount),
      invoiceId: returnData.invoiceId,
      orderID: returnData.orderId,
      customerAccount: returnData.account,
      paymentDueDate: returnData.paymentDueDate,
      items: returnData.items,
      returned: true,
    });

    await newReturn.save();

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
      totallWorth: -parseInt(returnData.discountedTotall), // Negative value for returns
    });

    await newReturnSale.save();

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

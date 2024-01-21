const Invoice = require("../modules/InvoiceSchema");
const { SalesToday } = require("../modules/SalesToday");
const { todoModal } = require("../modules/TodoSchema");
const Product = require("../modules/productSchema");
const { Sales } = require("../modules/salesSchema");

async function invoiceapi(req, res) {
  const invoiceData = req.body;
  try {
    const newInvoice = new Invoice({
      customerName: invoiceData.customerName,
      customerPhone: invoiceData.customerPhone,
      customerEmail: invoiceData.customerEmail,
      discountOffered: parseInt(invoiceData.discount),
      address: invoiceData.address,
      paymentMethod: invoiceData.paymentMethod,
      totallWithoutDiscount: parseInt(invoiceData.totallPrice),
      totallWithDiscount: parseInt(invoiceData.discountedTotall),
      discountAmount: parseInt(invoiceData.discountAmount),
      invoiceId: invoiceData.invoiceId,
      orderID: invoiceData.orderId,
      customerAccount: invoiceData.account,
      paymentDueDate: invoiceData.paymentDueDate,
      items: invoiceData.items,
    });

    await newInvoice
      .save()
      .then(async () => {
        try {
          Object.keys(invoiceData.items).forEach(async (item) => {
            const target = await Product.findOne({ barCode: item });
            const update = {
              stockQuantity:
                parseInt(target.stockQuantity) -
                parseInt(invoiceData.items[item]),
              amountSold:
                parseInt(target.amountSold) + parseInt(invoiceData.items[item]),
            };
            await Product.findOneAndUpdate({ barCode: item }, update);
            const updatedTarget = await Product.findOne({ barCode: item });
            const dailySales = new SalesToday({
              productName: target.productName,
              itemBarcode: target.barCode,
              stockPurchased: parseInt(invoiceData.items[item]),
              price: target.unitPrice,
              productQuantity: invoiceData.items[item],
              stockRemaining: updatedTarget.stockQuantity,
              discountGiven: invoiceData.discount,
              buyerName: invoiceData.customerName,
            });
            await dailySales.save();
          });
        } catch (err) {
          res.json({ message: err.message });
        }
      })
      .then(async () => {
        try {
          const newSale = new Sales({
            productsList: invoiceData.items,
            discountWorth: newInvoice.discountAmount,
            date: new Date(),
            buyerName: newInvoice.customerName,
            totallWorth: parseInt(invoiceData.discountedTotall),
          });
          await newSale.save();
        } catch (err) {
          res.json({ message: err.message });
        }
      })
      .then(() => {
        res.json({ message: "Invoice has been created successfully" });
      });
  } catch (err) {
    res.json({ message: err.message });
  }
}

module.exports = { invoiceapi };

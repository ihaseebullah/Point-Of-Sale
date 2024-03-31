const { Customer } = require("../modules/Customer");
const Invoice = require("../modules/InvoiceSchema");
const ProductReport = require("../modules/ProductReport");
const { SalesToday } = require("../modules/SalesToday");
const { todoModal } = require("../modules/TodoSchema");
const { User } = require("../modules/User");
const Product = require("../modules/productSchema");
const { Sales } = require("../modules/salesSchema");
const { Stats } = require("../modules/statsSchema");

async function invoiceapi(req, res) {
  const invoiceData = req.body;
  console.log(invoiceData);
  try {
    
    let amountRemaining = (parseInt(invoiceData.debts) + parseInt(invoiceData.discountedTotall2) - parseInt(invoiceData.paidAmount));
    const newInvoice = new Invoice({
      customerName: invoiceData.customerName,
      customerPhone: invoiceData.customerPhone,
      customerEmail: invoiceData.customerEmail,
      discountOffered: parseInt(invoiceData.discount),
      address: invoiceData.address,
      paymentMethod: invoiceData.paymentMethod,
      totallWithoutDiscount: parseInt(invoiceData.totallPrice),
      totallWithDiscount: parseInt(invoiceData.discountedTotall2),
      discountAmount: parseInt(invoiceData.discountAmount),
      invoiceId: invoiceData.invoiceId,
      orderID: invoiceData.orderId,
      customerAccount: invoiceData.account,
      paymentDueDate: invoiceData.paymentDueDate,
      items: invoiceData.items,
      returned: false,
      paidAmount: invoiceData.paidAmount,
      amountRemaining: amountRemaining,
      debts: invoiceData.debts,
      invoiceStatus: (amountRemaining === 0 ? "Paid Completely" : "Incomplete payment")
    });
    const lastInvoice = await Invoice.findOne({ customerAccount: newInvoice.customerAccount }).sort({ createdAt: -1 })
    const updateThePreviousInvoice = {
      invoiceStatus: lastInvoice.invoiceStatus === "Incomplete payment" ? "New Invoice Available" : "Paid Completely"
    }
    await Invoice.findByIdAndUpdate(lastInvoice._id, updateThePreviousInvoice)
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
            //update product Reports
            const product = await ProductReport.findOne({ barCode: item });

            {
              /* eslint-disable */
            }
            if (product) {
              const productReportUpdate = {
                barCode: item,
                profit:
                  (target.unitPrice - target.purchasedPrice) *
                  parseInt(invoiceData.items[item]) +
                  parseInt(product.profit),
                itemSold: product.itemSold
                  ? parseInt(product.itemSold) +
                  parseInt(invoiceData.items[item])
                  : parseInt(invoiceData.items[item]),
              };
              await ProductReport.updateOne(
                { barCode: item },
                productReportUpdate
              );
            } else {
              const newProductReport = new ProductReport({
                barCode: target.barCode,
                productName: target.productName,
                unitPrice: target.unitPrice,
                purchasedPrice: target.purchasedPrice,
                profit:
                  (parseInt(target.unitPrice) -
                    parseInt(target.purchasedPrice)) *
                  parseInt(invoiceData.items[item]),
                itemSold: parseInt(invoiceData.items[item]),
              });
              await newProductReport.save();
            }
            {
              /* eslint-disable */
            }
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
          console.log(err);
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
            totallWorth: parseInt(invoiceData.discountedTotall2),
          });
          await newSale.save();
        } catch (err) {
          console.log(err);
          res.json({ message: err.message });
        }
      })

      .then(async () => {
        try {
          const areStatsAvailable = await Stats.findOne({
            month: new Date().getMonth(),
          });
          if (areStatsAvailable) {
            const statUpdate = {
              invoiceCounter: parseInt(areStatsAvailable.invoiceCounter) + 1,
            };
            const update = await Stats.findOneAndUpdate(
              { month: new Date().getMonth() },
              statUpdate
            );
            console.log("Old stats data were updated", update);
          } else {
            const newStat = new Stats({
              month: new Date().getMonth(),
              monthName: new Date().toLocaleString("default", {
                month: "long",
              }),
              invoiceCounter: 1,
            });
            await newStat.save();
            console.log("New Stats Created", newStat);
          }
        } catch (e) {
          console.log(e.message, e);
        }
      })

      .then(async () => {
        try {
          const user = await User.findById(req.session.User._id);
          if (user) {
            await User.findByIdAndUpdate(req.session.User._id, {
              invoicesCreated: user.invoicesCreated
                ? user.invoicesCreated + 1
                : 1,
              sales: user.sales
                ? user.sales + parseInt(invoiceData.discountedTotall2)
                : parseInt(invoiceData.discountedTotall2),
            });
          }
          const userFound = await Customer.findOne({
            accountNumber: invoiceData.account,
          });
          const invId = await Invoice.find({}).sort({ createdAt: -1 }).limit(1);
          await Invoice.findByIdAndUpdate(invId[0], {
            oldAccount: userFound ? userFound.account : 0,
          });
          if (
            userFound
              ? userFound.accountNumber
              : userFound === invoiceData.account
          ) {
            const update = {
              invoices: [...userFound.invoices, invId[0]._id],
              account:
                parseInt(userFound.account) +
                parseInt(invoiceData.discountedTotall2) -
                parseInt(invoiceData.paidAmount),
              dueDate: invoiceData.paymentDueDate,
              assistedBy:
                req.session.User.firstName + " " + req.session.User.lastName,
            };
            console.log(update)
            await Customer.findOneAndUpdate(
              { accountNumber: invoiceData.account },
              update
            );
          } else {
            const newCustomer = new Customer({
              customerName: invoiceData.customerName,
              customerPhone: invoiceData.customerPhone,
              customerEmail: invoiceData.customerEmail,
              address: invoiceData.address,
              paymentMethod: invoiceData.paymentMethod,
              amountRemaining: invoiceData.amountRemaining,
              account: invoiceData.discountedTotall2 - invoiceData.paidAmount,
              accountNumber: invoiceData.account,
              invoices: invId[0]._id,
              assistedBy:
                req.session.User.firstName + " " + req.session.User.lastName,
              dueDate: invoiceData.paymentDueDate,
            });
            await newCustomer.save();
          }
        } catch (e) {
          console.log(e.message, e);
        }
      })
      .then(() => {
        res.json({ message: "Invoice has been created successfully" });
      });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
}

module.exports = { invoiceapi };

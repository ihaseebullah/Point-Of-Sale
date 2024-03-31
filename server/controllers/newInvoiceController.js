const { Customer } = require("../modules/Customer");
const Invoice = require("../modules/InvoiceSchema");
const ProductReport = require("../modules/ProductReport");
const { SalesToday } = require("../modules/SalesToday");
const { StoreStats } = require("../modules/StoreStatsCounter");
const { todoModal } = require("../modules/TodoSchema");
const { User } = require("../modules/User");
const Product = require("../modules/productSchema");
const { Sales } = require("../modules/salesSchema");
const { Stats } = require("../modules/statsSchema");

async function newInvoiceMakingApi(req, res) {
    //Req 1 - Invoice Making
    const randomId = Math.floor(Math.random() * 12372);

    const {
        amountRemaining,
        cartData,
        totalPrice,
        totallDiscount,
        cashDiscount,
        paidAmount,
        customerName,
        address,
        customerPhone,
        debts,
        newInvoiceSerial,
        accountNumber,
        newRandomAccountNumber,
    } = req.body;
    const products = await Product.find({})
    let items = {};
    Object.keys(cartData).map((key) => {
        let temp = products.find((item) => item._id == key);
        if (temp) {
            items = { ...items, [temp.barCode]: cartData[key].quantitiy }
        }
    })
    const totallAmount = parseInt(cashDiscount) + parseInt(paidAmount) + parseInt(totallDiscount) + parseInt(amountRemaining);
    const grandDiscount = parseInt(cashDiscount) + parseInt(totallDiscount);
    const newInvoice = new Invoice({
        customerName: customerName,
        customerPhone: customerPhone,
        // customerEmail: String,
        discountOffered: parseInt(cashDiscount) + parseInt(totallDiscount),
        address: address,
        totallWithoutDiscount: totallAmount,
        totallWithDiscount: totallAmount - grandDiscount,
        discountAmount: grandDiscount,
        invoiceId: newInvoiceSerial,
        orderID: newInvoiceSerial,
        customerAccount: accountNumber === "newcustomer" ? randomId : accountNumber,
        // paymentDueDate: String,
        invoiceStatus: (amountRemaining <= 0 ? "Paid Completely" : "Incomplete payment"),
        newStyleItems: cartData,
        items: items,
        returned: false,
        payments: {},
        paidAmount: parseInt(paidAmount),
        amountRemaining: amountRemaining,
        debts: debts,
    })
    console.log(newInvoice)
    if (customerName != "walkincustomer") {
        if (accountNumber != "newcustomer") {
            const lastInvoice = await Invoice.findOne({ customerAccount: newInvoice.customerAccount }).sort({ createdAt: -1 })
            if (lastInvoice) {
                const updateThePreviousInvoice = {
                    invoiceStatus: lastInvoice.invoiceStatus === "Incomplete payment" ? "New Invoice Available" : "Paid Completely"
                }
                await Invoice.findByIdAndUpdate(lastInvoice._id, updateThePreviousInvoice)
            }

        }
    }
    await newInvoice
        .save().then(async () => {
            try {
                Object.keys(newInvoice.items).forEach(async (item) => {
                    const target = await Product.findOne({ barCode: item });
                    const update = {
                        stockQuantity:
                            parseInt(target.stockQuantity) -
                            parseInt(newInvoice.items[item]),
                        amountSold:
                            parseInt(target.amountSold) + parseInt(newInvoice.items[item]),
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
                                parseInt(newInvoice.items[item]) +
                                parseInt(product.profit),
                            itemSold: product.itemSold
                                ? parseInt(product.itemSold) +
                                parseInt(newInvoice.items[item])
                                : parseInt(newInvoice.items[item]),
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
                                parseInt(newInvoice.items[item]),
                            itemSold: parseInt(newInvoice.items[item]),
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
                        stockPurchased: parseInt(newInvoice.items[item]),
                        price: target.unitPrice,
                        productQuantity: newInvoice.items[item],
                        stockRemaining: updatedTarget.stockQuantity,
                        discountGiven: grandDiscount,
                        buyerName: newInvoice.customerName,
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
                    productsList: newInvoice.items,
                    discountWorth: newInvoice.discountAmount,
                    date: new Date(),
                    buyerName: newInvoice.customerName,
                    totallWorth: parseInt(newInvoice.totallWithDiscount),
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
                            ? user.sales + parseInt(newInvoice.discountAmount)
                            : parseInt(newInvoice.discountAmount),
                    });
                }


                //Customer account creation and updation
                if (customerName === "walkincustomer") {

                } else {
                    const userFound = await Customer.findOne({
                        accountNumber: newInvoice.customerAccount,
                    });
                    const invId = await Invoice.find({}).sort({ createdAt: -1 }).limit(1);
                    await Invoice.findByIdAndUpdate(invId[0], {
                        oldAccount: userFound ? userFound.account : 0,
                    });
                    if (
                        userFound
                            ? userFound.accountNumber
                            : userFound === newInvoice.customerAccount
                    ) {
                        const update = {
                            invoices: [...userFound.invoices, invId[0]._id],
                            account: newInvoice.amountRemaining,
                            dueDate: newInvoice.paymentDueDate,
                            assistedBy:
                                req.session.User.firstName + " " + req.session.User.lastName,
                        };
                        console.log(update)
                        await Customer.findOneAndUpdate(
                            { accountNumber: newInvoice.customerAccount },
                            update
                        );
                    } else {
                        const newCustomer = new Customer({
                            customerName: newInvoice.customerName,
                            customerPhone: newInvoice.customerPhone,
                            customerEmail: newInvoice.customerEmail,
                            address: newInvoice.address,
                            paymentMethod: newInvoice.paymentMethod,
                            amountRemaining: newInvoice.amountRemaining,
                            account: newInvoice.amountRemaining,
                            accountNumber: randomId,
                            invoices: invId[0]._id,
                            assistedBy:
                                req.session.User.firstName + " " + req.session.User.lastName,
                            dueDate: newInvoice.paymentDueDate,
                        });
                        await newCustomer.save();
                    }
                }

            } catch (e) {
                console.log(e.message, e);
            }
        }).then(async () => {
            const data = await StoreStats.find({})
            if (data.length === 0) {
                const initStoreStats = new StoreStats({
                    amountInChest: parseInt(newInvoice.paidAmount),
                    amountToRecieve: parseInt(newInvoice.amountRemaining),
                })
                initStoreStats.save()
            } else {
                await StoreStats.findByIdAndUpdate(data[0]._id, {
                    amountToRecieve: parseInt(data[0].amountToRecieve) + parseInt(newInvoice.amountRemaining),
                    amountInChest: parseInt(data[0].amountInChest) + parseInt(newInvoice.paidAmount)
                })
            }
        })
        .then(async () => {
            const createdInvoice = await Invoice.findOne({}).sort({ createdAt: -1 })
            res.json({ createdInvoiceID: createdInvoice._id, statusCode: 200, message: "Invoice has been created successfully" });
        });

}

module.exports = { newInvoiceMakingApi }
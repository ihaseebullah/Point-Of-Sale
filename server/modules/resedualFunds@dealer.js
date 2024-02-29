const mongoose=require("mongoose")
const resedualFundsPaymentInvoice=new mongoose.Schema({
    amountPaid:Number,
    amountRemains:Number,
    accountNumber:String,
    dealerName:String,
    assistedBy:String,
},{timestamps:true})

const RESFUNDS=mongoose.model("Resedual Funds",resedualFundsPaymentInvoice)

module.exports={RESFUNDS}
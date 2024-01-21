const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true })

const todoModal = mongoose.model('Todo', todoSchema)
module.exports = { todoModal }
const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  calculationId: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  storeName: { type: String, required: true },
  total: { type: Number, required: true },
  buyer: { type: String, required: true },
  meToPay: Number,
  themToPay: Number,
  myDeductions: {
    list: [Number],
    sum: Number,
  },
  theirDeductions: {
    list: [Number],
    sum: Number,
  },
});

module.exports = mongoose.model("Receipt", receiptSchema);

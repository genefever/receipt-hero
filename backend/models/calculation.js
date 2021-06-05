const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  id: { type: String, required: true },
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

const calculationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: "Untitled" },
    receipts: [receiptSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calculation", calculationSchema);

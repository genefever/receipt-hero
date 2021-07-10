const mongoose = require("mongoose");
const User = require("./user");

const receiptSchema = new mongoose.Schema({
  id: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  storeName: { type: String, required: true },
  total: { type: Number, required: true },
  sharedTotal: { type: Number, required: true },
  buyer: { type: String, required: true },
  settlement: { type: mongoose.Schema.Types.Mixed, required: true },
  people: { type: Array, required: true },
});

const calculationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: "Untitled" },
    receipts: [receiptSchema],
    people: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calculation", calculationSchema);

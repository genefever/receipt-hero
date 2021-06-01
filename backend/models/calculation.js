const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  title: { type: String, default: "Untitled" },
});

module.exports = mongoose.model("Calculation", calculationSchema);

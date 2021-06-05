const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    googleId: String,
    facebookId: String,
    password: String,
    calculations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Calculation" },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);

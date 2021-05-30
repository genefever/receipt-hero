const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  googleId: String,
  facebookId: String,
  password: String,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);

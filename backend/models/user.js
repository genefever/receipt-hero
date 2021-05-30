const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String, //{ type: String, required: true },
  password: String, //{ type: String, required: true },
  googleId: String,
  facebookId: String,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  username: String, //{ type: String, required: true },
  email: String, //{ type: String, required: true },
  password: String, //{ type: String, required: true },
  googleId: String,
  facebookId: String,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);

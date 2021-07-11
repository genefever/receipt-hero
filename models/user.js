const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    google: {
      id: String,
      email: String,
      firstName: String,
      lastName: String,
    },
    facebook: {
      id: String,
      email: String,
      firstName: String,
      lastName: String,
    },
    password: String,
    calculations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Calculation" },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    profileImage: String,
    taxRate: Number,
  },
  { timestamps: true }
);

userSchema.plugin(findOrCreate);

// Hash password on save if user creates new account / changes password.
userSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);

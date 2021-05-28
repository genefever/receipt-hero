const bcrypt = require("bcrypt");
const User = require("../models/user");

const userSignUp = (req, res, next) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Failed while looking up user email.", error: err });
    }
    if (doc) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        await newUser.save();
        res.send(200);
      } catch (err) {
        res
          .status(500)
          .json({ message: "Failed to create new user.", error: err });
      }
    }
  });
};

const userLogin = (req, res, next) => {
  //TODO
};

module.exports = { userSignUp, userLogin };

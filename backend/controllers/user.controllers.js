const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");
require("../config/passportConfig")(passport);

const userSignUp = (req, res, next) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) {
      return res.status(500).json({
        message: `Failed while looking up username: ${username}.`,
        error: err,
      });
    }
    if (doc) {
      return res
        .status(409)
        .json({ message: "An account with this username already exists." });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });

        await newUser.save();
        res.sendStatus(200);
      } catch (err) {
        res
          .status(500)
          .json({ message: "Failed to create new user.", error: err });
      }
    }
  });
};

const userLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "User does not exist." });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        message: "Successfully authenticated.",
        userDetails: {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
      });
    });
  })(req, res, next);
};

module.exports = { userSignUp, userLogin };

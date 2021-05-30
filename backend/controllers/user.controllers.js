const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");
require("../config/passportConfig")(passport);

const signup = (req, res, next) => {
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

        const result = await newUser.save();
        res.status(201).json({
          userId: result._id,
          email: result.email,
          username: result.username,
        });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Failed to create new user.", error: err });
      }
    }
  });
};

const login = (req, res, next) => {
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

const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["email", "openid", "profile"] })(
    req,
    res,
    next
  );
};

const googleAuthCallback = (req, res, next) => {
  console.log("1");
  passport.authenticate("google", { failureRedirect: "/login" })(
    req,
    res,
    next
  ),
    (function (req, res, next) {
      console.log(res);
      // Successful authentication, redirect home.
      res.redirect("http://localhost:3000");
    })(req, res, next);
};

module.exports = { signup, login, googleAuth, googleAuthCallback };

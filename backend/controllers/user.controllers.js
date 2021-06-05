const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");
require("../config/passportConfig")(passport);

const getAuthenticatedUser = (req, res) => {
  res.send(req.user);
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id }, function (err, user) {
    if (err) {
      return res.status(500).json({
        message: "Failed while looking up user.",
        err: err,
      });
    }
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    return user;
  });
};

const signup = (req, res, next) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) {
      return res.status(500).json({
        message: `Failed while looking up email: ${email}.`,
        error: err,
      });
    }
    if (doc) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
        });

        newUser.save(function (err) {
          if (err) {
            throw err;
          } else {
            req.login(newUser, function (err) {
              if (err) {
                throw err;
              }
              res.status(201).json({
                message: "Successfully created new user.",
                userObject: {
                  createdAt: req.user.createdAt,
                  email: req.user.email,
                  firstName: req.user.firstName,
                  lastName: req.user.lastName,
                  updatedAt: req.user.updatedAt,
                  _id: req.user._id,
                },
              });
            });
          }
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
        userObject: {
          createdAt: req.user.createdAt,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          updatedAt: req.user.updatedAt,
          _id: req.user._id,
        },
      });
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  if (req.user) {
    req.logout();
    res.status("200").json({ message: "Successfully logged out." });
  }
};

const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["email", "openid", "profile"] })(
    req,
    res,
    next
  );
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })(req, res, next);
};

const facebookAuth = (req, res, next) => {
  passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
};

const facebookAuthCallback = (req, res, next) => {
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })(req, res, next);
};

module.exports = {
  getUser,
  getAuthenticatedUser,
  signup,
  login,
  logout,
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
};

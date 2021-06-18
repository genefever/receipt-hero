require("dotenv").config();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const passport = require("passport");
require("../config/passportConfig")(passport);
const async = require("async");
const crypto = require("crypto");

const getAuthenticatedUser = (req, res) => {
  res.send(req.user);
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
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
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
    // Delete the entire session from the server and clear the cookie on the
    // client side on successful logout.
    req.session.destroy(function (err) {
      if (!err) {
        res
          .status(200)
          .clearCookie("connect.sid", { path: "/" })
          .json({ message: "Successfully logged out." });
      } else {
        res.status(500).json({ message: "Failed to log user out." });
      }
    });
  }
};

const forgotPassword = (req, res, next) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (err) {
            res.status(500).json({
              message: "Failed to find email for forgot password.",
              error: err,
            });
            return;
          }
          if (!user) {
            //   req.flash('error', 'No account with that email address exists.');
            // return res.redirect('/forgot');
            res
              .status(400)
              .json({ message: "No account with that email address exists." });
            return;
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 900000; // 15 minutes

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_EMAIL_ADDRESS,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          },
        });

        var mailOptions = {
          to: user.email,
          from: {
            name: "Receipt Hero",
            address: "no-reply@receipthero.com",
          },
          subject: "Receipt Hero Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          // req.flash(
          //   "info",
          //   "An e-mail has been sent to " +
          //     user.email +
          //     " with further instructions."
          // );
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      // res.redirect("/forgot");
    }
  );
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
  getAuthenticatedUser,
  signup,
  login,
  logout,
  forgotPassword,
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
};

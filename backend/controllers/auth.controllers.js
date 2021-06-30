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
      return res.status(401).json({ message: "Incorrect email or password." });
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
          if (!user) {
            done(err, null, null, true);
            return;
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 900000; // 15 minutes

          user.save(function (err) {
            done(err, token, user, false);
          });
        });
      },
      function (token, user, shortCircuit, done) {
        if (shortCircuit) {
          done(null, "done");
        } else {
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
              "Hello,\n\n" +
              "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
              "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
              "http://" + // TODO: Change to https
              req.headers.host + // TODO: check if this will still work
              "/reset/" +
              token +
              "\n\n" +
              "If you did not request this, please ignore this email and your password will remain unchanged.\n\n\n" +
              "Thanks,\n" +
              "The Receipt Hero Team",
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            done(err, "done");
          });
        }
      },
    ],
    function (err) {
      if (err) return next(err);
      res.sendStatus(200);
    }
  );
};

// Post request - Saves user's new password if password token is valid.
const resetPassword = (req, res) => {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              done(err, null, true);
              return;
            }

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user, false);
              });
            });
          }
        );
      },
      function (user, shortCircuit, done) {
        if (shortCircuit) {
          done(true); // 'true' signifies that there was an error.
        } else {
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
          let mailOptions = {
            to: user.email,
            from: {
              name: "Receipt Hero",
              address: "no-reply@receipthero.com",
            },
            subject: "Your password has been changed",

            text:
              "Hello,\n\n" +
              "This is a confirmation that the password for your account " +
              user.email +
              " has just been changed.\n\n\n" +
              "Thanks,\n" +
              "The Receipt Hero Team",
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            done(err);
          });
        }
      },
    ],
    function (err) {
      if (err) {
        res.status(401).json({
          message: "The password reset link is invalid or has expired.",
        });
      } else {
        res
          .status(200)
          .json({ message: "Success! Your password has been changed." });
      }
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
  resetPassword,
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
};

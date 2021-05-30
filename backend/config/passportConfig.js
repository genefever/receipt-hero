require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return done(err);
          }
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      });
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      // Called on a successful authentication
      // Insert into database
      function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    )
  );

  // Persists user data (after successful authentication) into session.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Retrieves data from session.
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      const userInformation = {
        email: user.email,
        username: user.username,
        googleId: user.googleId,
      };
      done(err, userInformation);
    });
  });
};

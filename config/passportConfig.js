require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function (passport) {
  // Persists user data (after successful authentication) into session.
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Retrieves data from session.
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    }).select("-password");
  });

  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.password) {
          return done(null, false, {
            message: "Account exists with OAuth2 but password is not set.",
          });
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
        proxy: true,
        passReqToCallback: true,
      },
      // Uses account linking: https://codeburst.io/account-linking-with-passportjs-in-3-minutes-2cb1b09d4a76
      function (req, accessToken, refreshToken, profile, cb) {
        const { emails, name, id } = profile;
        // Check if user is authenticated.
        // If so, user needs to be authorized i.e. granted access to use Google next time.
        if (req.user) {
          let user = req.user;

          user.google.id = id;
          user.google.email = emails[0].value;
          user.google.firstName = name.givenName;
          user.google.lastName = name.familyName;

          user
            .save()
            .then((user) =>
              cb(null, user, {
                nextRoute: process.env.REACT_APP_FRONTEND_BASE_URL,
              })
            )
            .catch((err) => cb(err));
        } else {
          User.findOne({
            $or: [{ "google.id": id }, { email: emails[0].value }],
          }).then((user) => {
            if (!user) {
              // User is not auth'd, and not found on db? Then create an account.
              let newUser = new User();

              newUser.email = emails[0].value;
              newUser.google.id = id;
              newUser.google.email = emails[0].value;
              newUser.google.firstName = name.givenName;
              newUser.google.lastName = name.familyName;
              newUser.firstName = name.givenName;
              newUser.lastName = name.familyName;

              newUser
                .save()
                .then((user) => cb(null, user))
                .catch((err) => cb(err));
            } else {
              // User not auth'd but provider account found? Log the user in.
              user.google.id = id;
              user.google.email = emails[0].value;
              user.google.firstName = name.givenName;
              user.google.lastName = name.familyName;

              user
                .save()
                .then((user) => cb(null, user))
                .catch((err) => cb(err));
            }
          });
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        proxy: true,
        profileFields: ["id", "email", "name"],
      },
      function (req, accessToken, refreshToken, profile, cb) {
        const { emails, name, id } = profile;
        // Check if user is authenticated.
        // If so, user needs to be authorized i.e. granted access to use FB next time.
        if (req.user) {
          let user = req.user;

          user.facebook.id = id;
          user.facebook.email = emails[0].value;
          user.facebook.firstName = name.givenName;
          user.facebook.lastName = name.familyName;

          user
            .save()
            .then((user) =>
              cb(null, user, {
                nextRoute: process.env.REACT_APP_FRONTEND_BASE_URL,
              })
            )
            .catch((err) => cb(err));
        } else {
          User.findOne({
            $or: [{ "facebook.id": id }, { email: emails[0].value }],
          }).then((user) => {
            if (!user) {
              // User is not auth'd, and not found on db? Then create an account.
              let newUser = new User();

              newUser.email = emails[0].value;
              newUser.facebook.id = id;
              newUser.facebook.email = emails[0].value;
              newUser.facebook.firstName = name.givenName;
              newUser.facebook.lastName = name.familyName;
              newUser.firstName = name.givenName;
              newUser.lastName = name.familyName;

              newUser
                .save()
                .then((user) => cb(null, user))
                .catch((err) => cb(err));
            } else {
              // User not auth'd but provider account found? Log the user in.
              user.facebook.id = id;
              user.facebook.email = emails[0].value;
              user.facebook.firstName = name.givenName;
              user.facebook.lastName = name.familyName;

              user
                .save()
                .then((user) => cb(null, user))
                .catch((err) => cb(err));
            }
          });
        }
      }
    )
  );
};

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express(); // create the server

const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // restrict access to only our react app.
    credentials: true, // enables HTTP cookies over CORS.
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Route handler to fetch data from MongoDB
const router = express.Router();

mongoose.connect("mongodb://127.0.0.1:27017/details", {
  useNewUrlParser: true,
});

app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});

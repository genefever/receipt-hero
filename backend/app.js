require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const session = require("express-session");
const bodyParser = require("body-parser");
// Routes import
const userRouter = require("./routes/user.routes");
const calculationRouter = require("./routes/calculation.routes");

//---------------------------- END OF IMPORTS--------------------------------------
// Connect to Mongo DB
mongoose.connect(
  process.env.DEV_MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Mongoose is connected.")
);

// Create the server
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // location of the react app we're connecting to.
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

//-------------------------- END OF MIDDLEWARE------------------------------------

// Routes
app.use("/calculation/", calculationRouter);
app.use("/", userRouter);

//---------------------------- END OF ROUTES--------------------------------------

// Start server
app.listen(4000, () => {
  console.log("Server is running on Port: 4000");
});

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const session = require("express-session");
const bodyParser = require("body-parser");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
// Routes import
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const calculationRouter = require("./routes/calculation.routes");

//---------------------------- END OF IMPORTS--------------------------------------
// Connect to Mongo DB
mongoose.connect(
  process.env.DEV_MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => console.log("Mongoose is connected.")
);

// Create the server
const app = express();

// Configure redis
const redisClient = redis.createClient({
  port: 6379,
  host: "localhost",
});

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

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
    name: "_receiptHero",
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
    store: new redisStore({ client: redisClient }),
    cookie: {
      secure: false, // TODO: change to true. Only send the cookie back if the connection is secure/encrypted (https).
      httpOnly: true, // Prevents client side JS from reading the cookie.
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//-------------------------- END OF MIDDLEWARE------------------------------------

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/calculation", calculationRouter);

//---------------------------- END OF ROUTES--------------------------------------

// Start server
app.listen(4000, () => {
  console.log("Server is running on Port: 4000");
});

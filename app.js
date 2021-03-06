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
const path = require("path");
const url = require("url");

//---------------------------- END OF IMPORTS--------------------------------------
// Connect to Mongo DB
mongoose.connect(
  process.env.DEV_MONGODB_URI || process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => console.log("Mongoose is connected.")
);

// Create the server
const app = express();
const PORT = process.env.PORT || 4000;

// Configure redis
if (process.env.REDIS_URL) {
  const REDIS_URL = process.env.REDIS_URL;
  const redisURI = url.parse(REDIS_URL);
  const redisOptions = REDIS_URL.includes("rediss://")
    ? {
        port: Number(redisURI.port),
        host: redisURI.hostname,
        password: redisURI.auth.split(":")[1],
        db: 0,
        tls: {
          rejectUnauthorized: false,
        },
      }
    : REDIS_URL;
  var redisClient = redis.createClient(redisOptions);
} else {
  var redisClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: "localhost",
  });
}

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: [
      "https://receipthero.herokuapp.com",
      "http://receipthero.herokuapp.com",
      "http://localhost:3000",
    ], // location of the react app we're connecting to.
    credentials: true, // enables HTTP cookies over CORS.
  })
);
app.enable("trust proxy");
app.use(
  session({
    name: "_receiptHero",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new redisStore({ client: redisClient }),
    proxy: true, // add this when behind a reverse proxy, if you need secure cookies
    cookie: {
      //If true, it only sends the cookie back if the connection is secure/encrypted (https).
      secure: process.env.NODE_ENV === "production" ? true : false,
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

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // AFTER defining routes:
  // Anything that doesn't match what's above, send back index.html;
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

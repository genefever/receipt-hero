const { Router } = require("express");
const authControllers = require("../controllers/auth.controllers");

const router = Router();

// Local
router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);
router.get("/logout", authControllers.logout);
router.get("/getuser", authControllers.getAuthenticatedUser); // gets the logged in user
router.post("/forgot", authControllers.forgotPassword);

// OAuth 2.0
router.get("/google", authControllers.googleAuth);
router.get("/google/callback", authControllers.googleAuthCallback);
router.get("/facebook", authControllers.facebookAuth);
router.get("/facebook/callback", authControllers.facebookAuthCallback);

module.exports = router;

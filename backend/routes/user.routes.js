const { Router } = require("express");
const userControllers = require("../controllers/user.controllers");

const router = Router();

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.get("/logout", userControllers.logout);
router.get("/auth/google", userControllers.googleAuth);
router.get("/auth/google/callback", userControllers.googleAuthCallback);
router.get("/auth/facebook", userControllers.facebookAuth);
router.get("/auth/facebook/callback", userControllers.facebookAuthCallback);
router.get("/getauthuser", userControllers.getAuthenticatedUser); // gets the logged in user
router.get("/user/:id", userControllers.getUser);

module.exports = router;

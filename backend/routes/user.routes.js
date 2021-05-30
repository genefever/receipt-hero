const { Router } = require("express");
const userControllers = require("../controllers/user.controllers");

const router = Router();

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.get("/auth/google", userControllers.googleAuth);
router.get("/auth/google/callback", userControllers.googleAuthCallback);

module.exports = router;

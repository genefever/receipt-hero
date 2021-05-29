const { Router } = require("express");
const userControllers = require("../controllers/user.controllers");

const router = Router();

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);

module.exports = router;

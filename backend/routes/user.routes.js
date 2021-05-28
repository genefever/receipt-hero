const { Router } = require("express");
const userControllers = require("../controllers/user.controllers");

const router = Router();

router.post("/signup", userControllers.userSignUp);
router.post("/login", userControllers.userLogin);

module.exports = router;

const { Router } = require("express");
const userControllers = require("../controllers/user.controllers");

const router = Router();

router.get("/:id", userControllers.getUser);

module.exports = router;

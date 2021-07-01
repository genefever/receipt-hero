const { Router } = require("express");
const userControllers = require("../controllers/user.controllers");

const router = Router();

router.put("/settings", userControllers.updateUser);
router.get("/:id", userControllers.getUser);

module.exports = router;

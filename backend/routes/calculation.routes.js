const { Router } = require("express");
const calcControllers = require("../controllers/calculation.controllers");

const router = Router();

router.post("/create", calcControllers.createCalculation);

module.exports = router;

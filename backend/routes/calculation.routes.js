const { Router } = require("express");
const calcControllers = require("../controllers/calculation.controllers");

const router = Router();

router.post("/create", calcControllers.createCalculation);
router.get("/:id", calcControllers.getCalculation);
router.delete("/delete/:id", calcControllers.deleteCalculation);
router.put("/edit/:id", calcControllers.updateCalculation);

module.exports = router;

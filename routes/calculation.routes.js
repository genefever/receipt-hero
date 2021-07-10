const { Router } = require("express");
const calcControllers = require("../controllers/calculation.controllers");

const router = Router();

router.post("/create", calcControllers.createCalculation);
router.delete("/:id/delete", calcControllers.deleteCalculation);
router.put("/:id/edit", calcControllers.updateCalculation);
router.get("/:id", calcControllers.getCalculation);

module.exports = router;

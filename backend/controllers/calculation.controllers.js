const Calculation = require("../models/calculation");
const User = require("../models/user");

const createCalculation = (req, res) => {
  if (!req.isAuthenticated()) {
    res
      .status(401)
      .json({ message: "You must be logged in to create a calculation." });
  } else {
    try {
      const newCalculation = new Calculation({
        title: req.body.title,
        receipts: req.body.receipts,
        userId: req.user._id,
      });

      newCalculation.save().then((result) => {
        User.findById(req.user._id, (err, user) => {
          if (user) {
            user.calculations.push(newCalculation);
            user.save();
            res.status(201).json({
              message: "Successfully created a new calculation.",
            });
          }
        });
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to create a new calculation.", err: err });
    }
  }
};

module.exports = {
  createCalculation,
};

const User = require("../models/user");

const getUser = (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return res.status(500).json({
        message: "Failed while looking up user.",
        err: err,
      });
    }
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    res.send(user);
  })
    .select("-password")
    .populate("calculations", "title createdAt updatedAt");
};

const updateUser = (req, res) => {
  if (!req.isAuthenticated()) {
    res
      .status(401)
      .json({ message: "You must be logged in to update your user profile." });
  } else {
    User.updateOne({ _id: req.user._id }, req.body, (err) => {
      if (err)
        res.status(500).json({
          err: err,
          message: "Failed to update the user.",
        });
    });
    res.status(200).json({ message: "Successfully updated the user." });
  }
};

module.exports = {
  getUser,
  updateUser,
};

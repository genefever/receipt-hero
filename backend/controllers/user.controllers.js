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

module.exports = {
  getUser,
};

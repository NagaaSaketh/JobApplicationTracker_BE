const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }
    const decodedObject = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObject;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorised", error: err.message });
  }
};

module.exports = { userAuth };

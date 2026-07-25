const express = require("express");
const User = require("../models/user");
const bcrpyt = require("bcrypt");
const authRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validator");

// API route for creating a new user

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstname, lastname, email, password } = req.body;

    const hashedPassword = await bcrpyt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ message: "User created successfully!", data: savedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create new user", error: err.message });
  }
});

// API route for login

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrpyt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Invalid credentials", error: err.message });
  }
});

// API route for logout

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.status(200).send("Logout successful!");
});

// API route to verify logged-in user

authRouter.get("/auth", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      message: "User authenticated",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

module.exports = authRouter;

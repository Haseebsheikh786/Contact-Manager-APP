const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const router = express.Router();

const createToken = (_id) => {
  ``;
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
};  

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    let auth = false;
    const { username, email, password } = req.body;
    // if any field is empty
    if (!username || !email || !password) {
      res.status(400).json({ error: "All fields are mandatory", auth });
      throw new Error("All fields are mandatory");
    }

    // if email available in database
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400).json({ error: "User already registerd", auth });
      throw new Error("User already registerd");
    }

    // password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      auth = true;
      res.status(201).json({ _id: user.id, email: user.email, auth });
    } else {
      res.status(400).json({ error: "user data is not valid", auth });
      throw new Error("user data is not valid");
    }
    res.json({ message: "Register the user" });
  })
);

// login,
router.post(  
  "/login",
  asyncHandler(async (req, res) => {
    let auth = false;
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "All fields are mandatory", auth });
      throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (
      userAvailable && 
      (await bcrypt.compare(password, userAvailable.password))
    ) {
      auth = true;
      const token = createToken(userAvailable._id);
      res.status(200).json({ email, token, auth, _id: userAvailable._id });
    } else {
      auth = false;
      res.status(400).json({ error: "email or password is not valid", auth });
      throw new Error("email or password is not valid");
    }
  })
);

module.exports = router;

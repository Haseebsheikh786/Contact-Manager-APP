const assyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const validateToken = assyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ error: "authorization token required" });

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "not authorized" });
    next(err);
  }
});

module.exports = validateToken;

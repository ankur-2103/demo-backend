const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    const secret = process.env.SECERET;
    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      roles: decoded.roles,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (roles.some(role => role.name === "admin")) {
      return next();
    }

    return res.status(403).json({ message: "Require Admin Role!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (roles.some(role => role.name === "moderator" || role.name === "admin")) {
      return next();
    }

    return res.status(403).json({ message: "Require Moderator Role!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};

module.exports = authJwt;

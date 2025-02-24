const db = require("../models");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    await user.save(); 

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roles.map((role) => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      user.roles = [defaultRole._id];
    }

    await user.save();
    res.status(201).send({ message: "User registered successfully!" });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    const seceret = process.env.SECERET;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles.map(role => "ROLE_" + role.name.toUpperCase()),
      },
      seceret, 
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      }
    );

    res.status(200).send({
      accessToken: token,
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

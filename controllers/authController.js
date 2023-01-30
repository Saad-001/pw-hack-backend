const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const register = async (req, res, next) => {
  const saltRounds = 10;
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hash,
    });
    const user = await newUser.save();
    res.status(200).json(user._doc);
  } catch (err) {
    next(err);
  }
};

const logIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next({ status: 402, message: "user not found!" });

    const passwordIsCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsCorrect)
      return next({
        status: 404,
        message: "wrong password or user name is incorrect!",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    const { password, ...otherData } = user._doc;
    res.status(200).json({ ...otherData });
  } catch (err) {
    next(err);
  }
};

module.exports = { logIn, register };

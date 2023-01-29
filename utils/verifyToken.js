const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const toekn = req.cookies.access_token;
  if (!toekn) {
    return next({ status: 402, message: "You are not authenticated!" });
  }

  jwt.verify(toekn, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next({ status: 403, message: "token is not valid!" });
    }
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next({ status: 404, message: "you are not authorized!" });
    }
  });
};

module.exports = { verifyToken, verifyUser };

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const userMiddleware = (req, res, next) => {
  const token = req.headers.token;

  if (!token)
    return res.status(401).json({ message: "Authorization required" });

  const decoded = jwt.verify(token, JWT_SECRET)

  if (decoded) {
    req.userId = decoded.id
    next()
  } else {
    return res.status(401).json({
      message: "You are not signed in",
      code: 401
    })
  }
};

module.exports = userMiddleware;

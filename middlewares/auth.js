const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { handleValidationError, UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).json({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next(); // return next() to satisfy ESLint (consistent-return)
  } catch (err) {
    return handleValidationError(err, req, res); // proper error handling
  }
};


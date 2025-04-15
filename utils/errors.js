const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const CONFLICT = 409;
const FORBIDDEN = 403;

const handleValidationError = (err, req, res) => {
  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }
  if (err.statusCode === NOT_FOUND) {
    return res.status(NOT_FOUND).json({ message: err.message });
  }
  if (err.name === "ReferenceError") {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }
  if (err.statusCode === UNAUTHORIZED) {
    return res.status(UNAUTHORIZED).json({ message: err.message });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(UNAUTHORIZED).json({ message: "Invalid Token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(UNAUTHORIZED).json({ message: "Token Expired" });
  }
  if(err.statusCode === BAD_REQUEST) {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }
  if (err.name === "MongoServerError" && err.code === 11000) {
    // Handle duplicate key error (e.g., email already exists)
    return res.status(CONFLICT).json({ message: "Email already exists" });
  }
  if (err.statusCode === 11000) {
    // Handle duplicate email error
    return res.status(CONFLICT).json({ message: "Email already exists" });
  }
  if (err.statusCode === FORBIDDEN) {
    return res.status(FORBIDDEN).json({ message: err.message });
  }
  return res.status(SERVER_ERROR).json({ message: err.message });
};

module.exports = { handleValidationError, NOT_FOUND, FORBIDDEN, CONFLICT, BAD_REQUEST, SERVER_ERROR, UNAUTHORIZED };

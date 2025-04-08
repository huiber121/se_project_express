const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

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
  return res.status(SERVER_ERROR).json({ message: err.message });
};

module.exports = handleValidationError;

const bcrypt = require("bcryptjs"); // importing bcryptjs for password hashing
const jwt = require("jsonwebtoken"); // importing jsonwebtoken
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config"); // importing JWT_SECRET from config
const {
  NOT_FOUND,
  BAD_REQUEST,
  handleValidationError,
} = require("../utils/errors");
const { BadRequestError } = require("../utils/BadRequestError");
const { ConflictError } = require("../utils/ConflictError");

const getCurrentUser = (req, res) => {
  const userId = req.user._id; // Extract user ID from req.user (set by auth middleware)

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("User not found");
        err.statusCode = NOT_FOUND; // Set status code to 404
        return handleValidationError(err, req, res);
      }
      return res.json(user);
    })
    .catch((err) => handleValidationError(err, req, res)); // Handle errors
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("User not found");
        err.statusCode = NOT_FOUND; // Set status code to 404
        return handleValidationError(err, req, res);
      }
      return res.status(200).send(user);
    })
    .catch((err) => handleValidationError(err, req, res));
};

const updateUser = (req, res) => {
  const userId = req.user._id; // Extract user ID from req.user (set by auth middleware)
  const { name, avatar } = req.body; // Extract fields to update

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // Return the updated document and enable validation
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.json(user); // Return the updated user object
    })
    .catch((err) => handleValidationError(err, req, res)); // Handle validation errors
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) =>  User.create({ name, avatar, email, password: hash }))
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      }
      if (err.code === 11000) {
        next(new ConflictError("Email already exists"));
      } else {
        next(err); // Pass other errors to the error handler
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ token });
    })
    .catch((err) => handleValidationError(err, req, res));
};

module.exports = {
  getCurrentUser,
  getUserById,
  createUser,
  login,
  updateUser,
};

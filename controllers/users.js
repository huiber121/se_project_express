const bcrypt = require('bcryptjs'); // importing bcryptjs for password hashing
const jwt = require("jsonwebtoken"); // importing jsonwebtoken
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config"); // importing JWT_SECRET from config

const {
  NOT_FOUND,
  handleValidationError,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id; // Extract user ID from req.user (set by auth middleware)

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.json(user);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Internal Server Error", error: err.message });
    });
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

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Hash the password before saving
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash, // Save the hashed password
      })
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password; // Remove the password hash from the response
      res.status(201).send(userObject);
    })
    .catch((err) => handleValidationError(err, req, res));
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ token });
    })
    .catch((err) => 
      console.log("Error in login:", err) ||
      handleValidationError(err, req, res));
};

module.exports = {
  getCurrentUser,
  getUserById,
  createUser,
  login,
  updateUser,
};

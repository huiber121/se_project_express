// middleware
const User = require("../models/users");
const handleValidationError = require("../utils/errors");

const NOT_FOUND = 404;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => handleValidationError(err, req, res));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" }); // 404 instead of 200
      }
      return res.status(200).json(user);
    })
    .catch((err) => handleValidationError(err, req, res));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => handleValidationError(err, req, res));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
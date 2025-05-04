const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter the valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "You must enter the valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Static method to find a user by credentials
userSchema.statics.findUserByCredentials = function (email, password) {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = BAD_REQUEST; // mark it as 400 
    throw err;
  }
  return this.findOne({ email })
    .select("+password") // Include the password hash in the result
    .then((user) => {
      if (!user) {
        const err = new Error("Incorrect email or password");
        err.statusCode = UNAUTHORIZED; // mark it as 401
        throw err;
      }
      // Compare the provided password with the stored hash
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const err = new Error("Incorrect email or password");
          err.statusCode = UNAUTHORIZED;
          throw err; // mark it as 401
        }
        return user; // Return the user if the password matches
      });
    });
};

module.exports = mongoose.model("user", userSchema);

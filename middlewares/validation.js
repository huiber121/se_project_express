const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Define the functions that will validate:

// 1. The clothing item body when an item is created
// The item name is a required string of between 2 and 30 characters.
// An image URL is a required string in a URL format.

// 2. The user info body when a user is created
// The user name is a string of between 2 and 30 characters.
// The user avatar is a required string in a URL format.
// Email is a required string in a valid email format.
// Password is a required string.

// 3. Authentication when a user logs in
// Email is a required string in a valid email format.
// Password is a required string.

// 4. User and clothing item IDs when they are accessed
// IDs must be a hexadecimal value length of 24 characters.

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.error("string.uri");
        }
        return value;
      }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.error("string.uri");
        }
        return value;
      }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateIdParam = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateCreateItem,
  validateCreateUser,
  validateLogin,
  validateIdParam,
  validateId,
  validateURL,
};

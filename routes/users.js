const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateId,
} = require("../middlewares/validation");

// Now protected
router.get("/me", auth, validateId, getCurrentUser);
router.patch("/me", auth, validateId, updateUser);

module.exports = router;

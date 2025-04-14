const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// Route to get the current user
router.get("/me", getCurrentUser);

// Route to update the current user's profile
router.patch("/me", updateUser);

module.exports = router;
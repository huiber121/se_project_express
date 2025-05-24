const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateCreateItem,
  validateIdParam,
} = require("../middlewares/validation");

// public route
router.get("/", getItems);

// protected routes
router.post("/", auth, validateCreateItem, createItem);
router.delete("/:itemId", auth, validateIdParam, deleteItem);
router.put("/:itemId/likes", auth, validateIdParam, likeItem);
router.delete("/:itemId/likes", auth, validateIdParam, dislikeItem);

module.exports = router;

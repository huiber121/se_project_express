const router = require("express").Router();
const userRouter = require("./users");
const clothesRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothesRouter);

router.use((req, res, next) => {
  const error = new Error("Not found Route");
  error.status = NOT_FOUND;
  next(error);
});

module.exports = router;

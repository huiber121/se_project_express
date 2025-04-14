const router = require("express").Router();
const userRouter = require("./users");
const clothesRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothesRouter);

router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Not found Route" })
);

module.exports = router;

const router = require("express").Router();
const userRouter = require("./users");
const clothesRouter = require("./clothingItems");
const handleValidationError = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothesRouter);
router.use((req, res) => (err) => handleValidationError(err, req, res));

module.exports = router;

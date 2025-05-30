require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const {
  validateCreateUser,
  validateLogin,
} = require("./middlewares/validation");
const { handleError } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.use(cors());

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);

// Public routes FIRST (no auth)
app.post("/signup", validateCreateUser, createUser);
app.post("/signin", validateLogin, login);

// Main router AFTER auth
app.use("/", mainRouter);

app.use(errorLogger); // Error logger

// celebrate error handler
app.use(errors());

// Centralized error handler LAST
app.use((err, req, res, next) => {
  if (handleError(err)) {
    return res
      .status(err.statusCode || 500)
      .type("application/json")
      .json({ message: err.message || "Internal Server Error" });
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

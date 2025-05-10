const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");
const { createUser, login } = require("./controllers/users");
const { errors } = require("celebrate");
const {
  validateCreateUser,
  validateLogin,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.use(cors());

app.use(express.json());

// Public routes FIRST (no auth)
app.post("/signup", validateCreateUser, createUser);
app.post("/signin", validateLogin, login);

app.use(requestLogger);
// Main router AFTER auth
app.use("/", mainRouter);

app.use(errorLogger); // Error logger

// celebrate error handler
app.use(errors());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '646f3c4b2a0d1e8f5c7b8e9d', // Mock user ID for testing
//   };

//   next();
// });

// Centralized error handler LAST
app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .type("application/json")
    .json({ message: err.message || "Internal Server Error" });
  next(err);
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

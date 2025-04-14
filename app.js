const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");

const { createUser, login } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // ✅ mock user ID
  };
  next();
});
app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);
app.use("/", mainRouter);

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .type("application/json") // force JSON output
    .json({ message: err.message || "Internal Server Error" });
  next(err);
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

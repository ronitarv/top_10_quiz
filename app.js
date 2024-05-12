const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const quizzes_router = require("./controllers/quizzes");
const users_router = require("./controllers/users");
const login_router = require("./controllers/login");
const sessions_router = require("./controllers/sessions");
const middleware = require("./utils/middleware");

const port = 3000;

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use("/api/quizzes", middleware.user_extractor, quizzes_router);
app.use("/api/user", middleware.user_extractor, users_router);
app.use("/api/login", login_router);
app.use("/api/sessions", middleware.user_extractor, sessions_router);

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.use(middleware.error_handler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
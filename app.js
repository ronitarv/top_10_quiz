const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const quizzes_router = require("./controllers/quizzes");
const user_router = require("./controllers/user");
const login_router = require("./controllers/login");
const session_router = require("./controllers/sessions");
const middleware = require("./utils/middleware");

const port = 3000;

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use("/api/quizzes", middleware.user_extractor, quizzes_router);
app.use("/api/user", user_router);
app.use("/api/login", login_router);
app.use("/api/sessions", middleware.user_extractor, session_router);

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.use(middleware.error_handler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
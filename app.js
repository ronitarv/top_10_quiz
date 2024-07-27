const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const quizzesRouter = require("./controllers/quizzes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const sessionsRouter = require("./controllers/sessions");
const middleware = require("./utils/middleware");
const path = require("path")

const port = 3000;

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());
//app.use(express.static("dist"));
app.use("/", express.static(path.join(__dirname, "/dist")));


app.use("/api/quizzes", middleware.userExtractor, quizzesRouter);
app.use("/api/user", middleware.userExtractor, usersRouter);
app.use("/api/login", middleware.userExtractor, loginRouter);
app.use("/api/sessions", middleware.userExtractor, sessionsRouter);


app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '/dist')});
});

app.use(middleware.errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
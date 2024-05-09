const express = require('express');
const app = express();
const port = 3000;
const quizzes_router = require("./controllers/quizzes");

app.use("/quizzes", quizzes_router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
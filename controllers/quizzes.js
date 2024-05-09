const quizzes_router = require('express').Router();

quizzes_router.get("/", async (request, response) => {
  response.json([{question: "Largest countries", answers: [
    "hello"
  ]}]);
})

module.exports = quizzes_router;
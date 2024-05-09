const quizzes_router = require("express").Router();
const Quiz = require("../models/quiz");

quizzes_router.get("/", async (request, response) => {
  const quizzes = await Quiz.find({}).populate("user", {username: 1, name: 1});
  response.json(quizzes);
});

quizzes_router.post("/", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({error: "invalid token"});
  }
  const quiz = new Quiz({...request.body, user: user._id});
  const saved_quiz = await quiz.save();
  user.blogs = user.quizzes.concat(saved_quiz._id);
  await user.save();
  response.status(201).json(await saved_quiz.populate("user", {username: 1, name: 1}));
});

quizzes_router.delete("/:id", async (request, response) => {
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({error: "invalid token"});
    }
    const quiz = await Quiz.findById(request.params.id);
    if (!quiz) {
      return response.status(404).json({error: "quiz does not exist"});
    }
    if (!(user.id.toString() === quiz.user.toString())) {
      return response.status(401).json({error: "invalid token"});
    }
    await Quiz.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch(exception) {
    console.log(exception);
  }
});

module.exports = quizzes_router;
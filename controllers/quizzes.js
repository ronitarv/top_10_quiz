const quizzesRouter = require("express").Router();
const Quiz = require("../models/quiz");

quizzesRouter.get("/", async (request, response) => {
  if (request.user) {
    const quizzes = await Quiz.find({}).populate("user", { username: 1, name: 1 });
    response.json(quizzes);
  } else {
    const quizzes = await Quiz.find({}, { answers: 0 }).populate("user", { username: 1, name: 1 });
    response.json(quizzes);
  }
});

quizzesRouter.post("/", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "invalid token" });
  }
  Quiz.init()
    .then(async () => {
      const quiz = new Quiz({ ...request.body, user: user._id });
      const savedQuiz = await quiz.save();
      //user.blogs = user.quizzes.concat(savedQuiz._id);
      //await user.save();
      response.status(201).json(await savedQuiz.populate("user", { username: 1, name: 1 }));
    })
    .catch((error) => {
      response.status(400).json({ error: error.message });
    });
});

quizzesRouter.put("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "invalid token" });
  }
  const quiz = await Quiz.findById(request.params.id);
  if (!quiz) {
    return response.status(404).json({ error: "quiz not found" });
  }
  if (!(user.id.toString() === quiz.user.toString())) {
    return response.status(401).json({ error: "invalid token" });
  }
  const savedQuiz = await Quiz.findByIdAndUpdate(request.params.id, request.body, { new: true }).populate("user", { username: 1 });
  return response.status(200).json(savedQuiz);
});

quizzesRouter.delete("/:id", async (request, response) => {
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: "invalid token" });
    }
    const quiz = await Quiz.findById(request.params.id);
    if (!quiz) {
      return response.status(404).json({ error: "quiz does not exist" });
    }
    if (!(user.id.toString() === quiz.user.toString())) {
      return response.status(401).json({ error: "invalid token" });
    }
    await Quiz.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch(exception) {
    console.log(exception);
  }
});

module.exports = quizzesRouter;
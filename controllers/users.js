const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");
const Quiz = require("../models/quiz");
const Session = require("../models/session");

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!(username && username.length >= 3)) {
    return response.status(400).json({ error: "Username must be at least 3 characters long" });
  }
  if (!(password && password.length >= 4)) {
    return response.status(400).json({ error: "password must be at least 4 characters long" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);


  User.init()
    .then(async () => {
      const user = new User({
        username,
        name,
        passwordHash,
      });
      const savedUser = await user.save();
      response.status(201).json(savedUser);
    })
    .catch((error) => {
      response.status(400).json({ error: error._message === "User validation failed" ? "The username is taken" : error });
    });
});

userRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  if (!(user && user.id.toString() === request.params.id)) {
    return response.status(401).json({ error: "invalid token" });
  }
  await Session.deleteMany({ user: user.id });
  await Quiz.deleteMany({ user: user.id });
  await User.findByIdAndDelete(request.params.id);
  return response.status(204).end();
});

userRouter.put("/:id/save-quiz", async (request, response) => {
  const user = request.user;
  if (!(user && user.id.toString() === request.params.id)) {
    return response.status(401).json({ error: "invalid token" });
  }
  const quizId = request.body.quizId;
  if (user.savedQuizzes.includes(quizId)) {
    user.savedQuizzes = user.savedQuizzes.filter(q => q !== quizId);
  } else {
    user.savedQuizzes.push(quizId);
  }
  await user.save();
  return response.status(200).json({ savedQuizzes: user.savedQuizzes });
});

module.exports = userRouter;
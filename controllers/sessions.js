const sessionsRouter = require("express").Router();
const Session = require("../models/session");

sessionsRouter.get("/", async (request, response) => {
  const sessions = await Session.find({}).populate("user", { username: 1, name: 1 }).populate("quiz", { question: 1 });
  response.json(sessions);
});

sessionsRouter.get("/:id", async (request, response) => {
  const user = request.user;
  const session = await Session.findById(request.params.id);
  //response.json(await Session.findById(request.params.id).populate("user", {username: 1, name: 1}).populate("quiz", {question: 1})).end();
  if (!session) {
    return response.status(404).json({ error: "session does not exist" });
  }
  else if (user && user.id.toString() === session.user.toString()) {
    return response.status(200).json(await Session.findById(request.params.id).populate("user", { username: 1, name: 1 }).populate("quiz", { question: 1, answers: 1 }));
  } else {
    return response.status(200).json(await Session.findById(request.params.id).populate("user", { username: 1, name: 1 }).populate("quiz", { question: 1 }));
  }
});

sessionsRouter.post("/", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "invalid token" });
  }
  const session = new Session({ ...request.body, user: user._id });
  const newSession = await session.save();
  return response.status(201).json(await Session.findById(newSession.id).populate("user", { username: 1, name: 1 }).populate("quiz", { question: 1, answers: 1 }));
});

sessionsRouter.delete("/:id", async (request, response) => {
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: "invalid token" });
    }
    const session = await Session.findById(request.params.id);
    if (!session) {
      return response.status(404).json({ error: "session does not exist" });
    }
    if (!(user.id.toString() === session.user.toString())) {
      return response.status(401).json({ error: "invalid token" });
    }
    await Session.findByIdAndDelete(request.params.id);
    return response.status(204).end();
  } catch(exception) {
    console.log(exception);
  }
});

sessionsRouter.put("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "invalid token" });
  }
  const session = await Session.findById(request.params.id);
  if (!(user.id.toString() === session.user.toString())) {
    return response.status(401).json({ error: "invalid token" });
  }
  const savedSession = await Session.findByIdAndUpdate(request.params.id, request.body, { new: true }).populate("user", { username: 1, name: 1 }).populate("quiz", { question: 1, answers: 1 });

  return response.status(200).json(savedSession);
});

sessionsRouter.put("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "invalid token" });
  }
  const session = await Session.findById(request.params.id);
  if (!(user.id.toString() === session.user.toString())) {
    return response.status(401).json({ error: "invalid token" });
  }
  session.answers = request.params.answers;
  const savedSession = await session.save();
  return response.status(200).json(await savedSession.populate("user", { username: 1, name: 1 }).populate("quiz", { question: 1, answers: 1 }));
});

module.exports = sessionsRouter;
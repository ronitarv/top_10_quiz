const sessions_router = require("express").Router();
const Session = require("../models/session");

sessions_router.get("/", async (request, response) => {
  const sessions = await Session.find({}).populate("user", {username: 1, name: 1}).populate("quiz", {question: 1});
  response.json(sessions);
});

sessions_router.get("/:id", async (request, response) => {
  const user = request.user;
  const session = await Session.findById(request.params.id);
  //response.json(await Session.findById(request.params.id).populate("user", {username: 1, name: 1}).populate("quiz", {question: 1})).end();
  if (!session) {
    response.status(404).json({error: "session does not exist"});
  }
  if (user && user.id.toString() === session.user.toString()) {
    response.status(200).json(await Session.findById(request.params.id).populate("user", {username: 1, name: 1}).populate("quiz", {question: 1, answers: 1}));
  } else {
    response.status(200).json(await Session.findById(request.params.id).populate("user", {username: 1, name: 1}).populate("quiz", {question: 1}));
  }
});

sessions_router.post("/", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({error: "invalid token"});
  }
  const session = new Session({...request.body, user: user._id});
  const saved_session = await session.save();
  console.log("saved session", saved_session);
  response.status(201).json(await saved_session.populate("user", {username: 1, name: 1}).populate("quiz", {question: 1, answers: 1}));
});

sessions_router.delete("/:id", async (request, response) => {
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({error: "invalid token"});
    }
    const session = await Session.findById(request.params.id);
    if (!session) {
      return response.status(404).json({error: "session does not exist"});
    }
    if (!(user.id.toString() === session.user.toString())) {
      return response.status(401).json({error: "invalid token"});
    }
    await Session.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch(exception) {
    console.log(exception);
  }
});

sessions_router.put("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({error: "invalid token"});
  }
  const session = await Session.findById(request.params.id);
  if (!(user.id.toString() === session.user.toString())) {
    return response.status(401).json({error: "invalid token"});
  }
  const saved_session = await Session.findByIdAndUpdate(request.params.id, request.body).populate("user", {username: 1, name: 1}).populate("quiz", {question: 1, answers: 1});

  //const saved_session = await session.save();
  response.status(200).json(saved_session);
});

sessions_router.put("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({error: "invalid token"});
  }
  const session = await Session.findById(request.params.id);
  if (!(user.id.toString() === session.user.toString())) {
    return response.status(401).json({error: "invalid token"});
  }
  session.answers = request.params.answers;
  const saved_session = await session.save();
  response.status(200).json(await saved_session.populate("user", {username: 1, name: 1}).populate("quiz", {question: 1, answers: 1}));
});

module.exports = sessions_router;
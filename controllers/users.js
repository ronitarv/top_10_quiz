const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (request, response) => {
  const {username, name, password} = request.body;
  if (!(password && password.length >= 3)) {
    return response.status(400).json({error: "password must be at least 3 characters long"});
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
      response.status(400).json({error: error.message});
    });
});

userRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  if (!(user.id.toString() === request.params.id)) {
    return response.status(401).json({error: "invalid token"});
  }
  await User.findByIdAndDelete(request.params.id);
  return response.status(204).end();
});

module.exports = userRouter;
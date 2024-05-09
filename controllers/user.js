const bcrypt = require("bcrypt");
const user_router = require("express").Router();
const User = require("../models/user");

user_router.post("/", async (request, response) => {
  const {username, name, password} = request.body;
  if (!(password && password.length >= 3)) {
    return response.status(400).json({error: "password must be at least 3 characters long"});
  }
  const salt_rounds = 10;
  const password_hash = await bcrypt.hash(password, salt_rounds);

  const user = new User({
    username,
    name,
    password_hash,
  });

  const saved_user = await user.save();

  response.status(201).json(saved_user);
});

module.exports = user_router;
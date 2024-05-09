const mongoose = require("mongoose");
const unique_validator = require("mongoose-unique-validator");

const user_schema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  name: String,
  password_hash: String,
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz"
    }
  ]
});

user_schema.plugin(unique_validator);

user_schema.set("toJSON", {
  transform: (document, returned_object) => {
    returned_object.id = returned_object._id.toString();
    delete returned_object._id;
    delete returned_object.__v;
    delete returned_object.password_hash;
  }
});

module.exports = mongoose.model("User", user_schema);
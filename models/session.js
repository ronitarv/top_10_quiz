const mongoose = require("mongoose");
const unique_validator = require("mongoose-unique-validator");

const session_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  answers: {
    type: Array,
    default: ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"]
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
session_schema.plugin(unique_validator);
session_schema.set("toJSON", {
  transform: (document, returned_object) => {
    returned_object.id = returned_object._id.toString();
    delete returned_object._id;
    delete returned_object.__v;
    delete returned_object.password_hash;
  }
});

module.exports = mongoose.model("Session" ,session_schema);
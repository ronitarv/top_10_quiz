const mongoose = require("mongoose");

const quiz_schema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true
  },
  answers: [{
    type: String,
    required: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

quiz_schema.set("toJSON", {
  transform: (document, returned_object) => {
    returned_object.id = returned_object._id.toString();
    delete returned_object._id;
    delete returned_object.__v;
  }
});

module.exports = mongoose.model("Quiz", quiz_schema);
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
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

quizSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Quiz", quizSchema);
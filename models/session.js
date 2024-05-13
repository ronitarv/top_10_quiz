const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sessionSchema = new mongoose.Schema({
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
sessionSchema.plugin(uniqueValidator);
sessionSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

module.exports = mongoose.model("Session" ,sessionSchema);
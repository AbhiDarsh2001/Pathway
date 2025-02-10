const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  trait: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema); 
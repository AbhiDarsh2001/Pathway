const mongoose = require("mongoose");

const aptitudeQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  trait: {
    type: String,
    required: true,
    enum: ['Math', 'Verbal', 'Logic']
  },
  options: [{
    text: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema); 
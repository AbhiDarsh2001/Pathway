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
    score: { 
      type: Number, 
      required: true,
      min: 0,  // Ensure score is non-negative
      max: 100 // Allow scores up to 100
    }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema); 
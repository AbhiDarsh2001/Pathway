// models/QuizResult.js
const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockTest',
    required: [true, 'Test ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save middleware for additional validation
QuizResultSchema.pre('save', function(next) {
  if (this.score < 0) {
    next(new Error('Score cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);

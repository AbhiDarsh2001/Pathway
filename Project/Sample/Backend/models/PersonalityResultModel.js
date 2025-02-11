const mongoose = require("mongoose");

const personalityResultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  scores: {
    Neuroticism: { type: Number, required: true },
    Agreeableness: { type: Number, required: true },
    Conscientiousness: { type: Number, required: true },
    Openness: { type: Number, required: true },
    Extraversion: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PersonalityResult", personalityResultSchema); 
const mongoose = require("mongoose");

const personalityResultSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  scores: {
    extraversion: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    agreeableness: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    conscientiousness: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    neuroticism: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    openness: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    // math: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    //   max: 100
    // },
    // verbal: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    //   max: 100
    // },
    // logic: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    //   max: 100
    // }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PersonalityResult", personalityResultSchema); 
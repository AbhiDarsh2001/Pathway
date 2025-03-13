const mongoose = require("mongoose");

const aptitudeResultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  scores: {
    math: { type: Number, required: true },
    verbal: { type: Number, required: true },
    logic: { type: Number, required: true }
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AptitudeResult", aptitudeResultSchema); 
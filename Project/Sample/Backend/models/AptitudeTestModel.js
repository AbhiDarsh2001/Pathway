const mongoose = require("mongoose");

const aptitudeTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeQuestion'
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AptitudeTest", aptitudeTestSchema); 
const express = require("express");
const router = express.Router();
const Question = require("../models/QuestionModel");

// Add new question
router.post("/add-question", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete question
router.delete("/delete-question/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router; 
const express = require("express");
const router = express.Router();
const Question = require("../models/QuestionModel");
const PersonalityResult = require("../models/PersonalityResultModel");
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token." });
    }
    req.userId = decoded._id; // Save user ID from token
    next();
  });
};

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

// Get questions for student test (protected)
router.get("/test-questions", verifyToken, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Submit test results (protected)
router.post("/submit-test", verifyToken, async (req, res) => {
  try {
    const { scores } = req.body;
    const result = new PersonalityResult({
      userId: req.userId, // Use ID from token
      scores
    });
    await result.save();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user's test results (protected)
router.get("/results", verifyToken, async (req, res) => {
  try {
    const results = await PersonalityResult.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(1);
    res.status(200).json({ success: true, data: results[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router; 
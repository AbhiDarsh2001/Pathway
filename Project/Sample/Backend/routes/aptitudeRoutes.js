const express = require("express");
const router = express.Router();
const AptitudeQuestion = require("../models/AptitudeQuestionModel");
const AptitudeResult = require("../models/AptitudeResultModel");
const jwt = require("jsonwebtoken");
const AptitudeTest = require("../models/AptitudeTestModel");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: "No token provided." 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);
    req.email = decoded.email;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expired. Please login again.",
        expired: true
      });
    }
    return res.status(401).json({ 
      success: false,
      message: "Failed to authenticate token." 
    });
  }
};

// Add a new aptitude question
router.post("/add-question", async (req, res) => {
  try {
    const newQuestion = new AptitudeQuestion(req.body);
    await newQuestion.save();
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all aptitude questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await AptitudeQuestion.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete an aptitude question
router.delete("/delete-question/:id", async (req, res) => {
  try {
    const question = await AptitudeQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Submit aptitude test results
router.post("/submit-test", verifyToken, async (req, res) => {
  try {
    const { scores } = req.body;
    
    // Validate scores
    if (!scores || typeof scores !== "object") {
      return res.status(400).json({ success: false, error: "Invalid scores format" });
    }

    const requiredScores = ["math", "verbal", "logic"];
    for (const trait of requiredScores) {
      if (typeof scores[trait] !== "number" || scores[trait] < 0 || scores[trait] > 40) {
        return res.status(400).json({
          success: false,
          error: `Invalid score for ${trait}. Must be a number between 0 and 40.`
        });
      }
    }

    const newTest = new AptitudeResult({
      email: req.email,
      scores: {
        math: scores.math,
        verbal: scores.verbal,
        logic: scores.logic
      },
      timestamp: new Date()
    });

    const savedTest = await newTest.save();
    res.status(200).json({ success: true, data: savedTest });
  } catch (error) {
    console.error("Submit test error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's aptitude test results
router.get("/results", verifyToken, async (req, res) => {
  try {
    const results = await AptitudeResult.findOne({ email: req.email }).sort({ timestamp: -1 });
    if (!results) {
      return res.status(404).json({ success: false, message: "No test results found" });
    }
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all aptitude tests
router.get("/tests", async (req, res) => {
  try {
    const tests = await AptitudeTest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;

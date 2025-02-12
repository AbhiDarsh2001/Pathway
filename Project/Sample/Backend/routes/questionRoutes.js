const express = require("express");
const router = express.Router();
const Question = require("../models/QuestionModel");
const PersonalityResult = require("../models/PersonalityResultModel");
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
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
    if (err.name === 'TokenExpiredError') {
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

// Get or create personality test results
router.get('/results/:email', verifyToken, async (req, res) => {
    try {
        console.log('Searching for results with email:', req.params.email);

        let result = await PersonalityResult.findOne(
            { email: req.params.email }
        ).sort({ timestamp: -1 });

        if (!result) {
            // Create default test results if none exist
            result = new PersonalityResult({
                email: req.params.email,
                scores: {
                    extraversion: 25,    // Default scores (mid-range)
                    agreeableness: 25,
                    conscientiousness: 25,
                    neuroticism: 25,
                    openness: 25,
                    math: 50,           // Default aptitude scores
                    verbal: 50,
                    logic: 50
                }
            });
            await result.save();
            console.log('Created default result:', result);
        } else {
            console.log('Found existing result:', result);
        }

        // Make sure the scores exist
        if (!result.scores) {
            return res.status(404).json({
                success: false,
                message: 'Invalid test results found. Please take the personality test.'
            });
        }

        res.json({
            success: true,
            scores: result.scores,
            isDefault: !result.timestamp // Indicate if these are default scores
        });
    } catch (error) {
        console.error('Error handling personality results:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error handling personality results' 
        });
    }
});

// Save test results (protected)
router.post('/results', verifyToken, async (req, res) => {
    try {
        const { scores } = req.body;
        
        // Validate scores
        if (!scores || typeof scores !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Invalid scores data'
            });
        }

        // Create new result
        const newResult = new PersonalityResult({
            email: req.email,
            scores: {
                extraversion: scores.extraversion,
                agreeableness: scores.agreeableness,
                conscientiousness: scores.conscientiousness,
                neuroticism: scores.neuroticism,
                openness: scores.openness,
                math: scores.math,
                verbal: scores.verbal,
                logic: scores.logic
            }
        });

        await newResult.save();
        console.log('Saved new result:', newResult); // Debug log

        res.status(201).json({
            success: true,
            message: 'Personality test results saved successfully'
        });
    } catch (error) {
        console.error('Error saving personality results:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving personality results'
        });
    }
});

module.exports = router; 
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

// Submit test results
router.post('/submit-test', verifyToken, async (req, res) => {
  try {
    const { scores } = req.body;
    
    // Validate scores
    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid scores format' 
      });
    }

    // Validate required score fields
    const requiredScores = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];
    for (const trait of requiredScores) {
      if (typeof scores[trait] !== 'number' || scores[trait] < 0 || scores[trait] > 100) {
        return res.status(400).json({
          success: false,
          error: `Invalid score for ${trait}. Must be a number between 0 and 100.`
        });
      }
    }

    const newTest = new PersonalityResult({
      email: req.email,
      scores: {
        extraversion: scores.extraversion,
        agreeableness: scores.agreeableness,
        conscientiousness: scores.conscientiousness,
        neuroticism: scores.neuroticism,
        openness: scores.openness,
        math: scores.math || 0,
        verbal: scores.verbal || 0,
        logic: scores.logic || 0
      },
      timestamp: new Date()
    });

    const savedTest = await newTest.save();
    
    res.status(200).json({
      success: true,
      data: savedTest
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's test results (protected)
router.get("/results", verifyToken, async (req, res) => {
  try {
    const results = await PersonalityResult.findOne({ email: req.email })
      .sort({ timestamp: -1 });

    if (!results) {
      return res.status(404).json({ 
        success: false, 
        message: 'No test results found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
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
                    extraversion: 50,    // Default scores (mid-range on 100-point scale)
                    agreeableness: 50,
                    conscientiousness: 50,
                    neuroticism: 50,
                    openness: 50
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
            isDefault: !result.timestamp
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
                // math: scores.math,
                // verbal: scores.verbal,
                // logic: scores.logic
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
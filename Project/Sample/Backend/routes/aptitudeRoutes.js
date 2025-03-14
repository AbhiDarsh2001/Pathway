const express = require("express");
const router = express.Router();
const AptitudeQuestion = require("../models/AptitudeQuestionModel");
const AptitudeResult = require("../models/AptitudeResultModel");
const jwt = require("jsonwebtoken");
const AptitudeTest = require("../models/AptitudeTestModel");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  try {
    console.log("Request headers:", JSON.stringify(req.headers));
    
    const token = req.headers["authorization"];
    console.log("Raw token value:", token);
    
    if (!token) {
      return res.status(403).json({ 
        success: false,
        message: "No token provided." 
      });
    }

    // Remove 'Bearer ' prefix if present
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
    console.log("Token for verification:", tokenString.substring(0, 15) + "...");
    
    try {
      console.log("JWT secret key exists:", !!process.env.JSON_WEB_TOKEN_SECRET_KEY);
      const decoded = jwt.verify(tokenString, process.env.JSON_WEB_TOKEN_SECRET_KEY);
      console.log("Decoded token:", decoded);
      req.email = decoded.email;
      next();
    } catch (err) {
      console.error("Token verification error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false,
          message: "Token expired. Please login again.",
          expired: true
        });
      }
      return res.status(401).json({ 
        success: false,
        message: "Failed to authenticate token: " + err.message
      });
    }
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in authentication"
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

// Get test settings
router.get("/test-settings", async (req, res) => {
  try {
    let testSettings = await AptitudeTest.findOne();
    
    // If no settings exist, create default settings
    if (!testSettings) {
      testSettings = await AptitudeTest.create({
        title: "Aptitude Test",
        description: "Evaluate your cognitive abilities across different domains.",
        duration: 30 // Default 30 minutes
      });
    }
    
    res.status(200).json({ success: true, data: testSettings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Temporarily remove verifyToken middleware 
router.post("/update-settings", async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    
    // Validate duration
    if (duration <= 0) {
      return res.status(400).json({
        success: false,
        error: "Duration must be greater than 0"
      });
    }
    
    // Find existing test settings or create new one
    let testSettings = await AptitudeTest.findOne();
    
    if (testSettings) {
      testSettings.title = title;
      testSettings.description = description;
      testSettings.duration = duration;
      await testSettings.save();
    } else {
      testSettings = await AptitudeTest.create({
        title,
        description,
        duration
      });
    }
    
    res.status(200).json({ success: true, data: testSettings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add this new route without token verification for temporary use
router.post("/update-settings-bypass", async (req, res) => {
  try {
    console.log("Received bypass update request:", req.body);
    
    const { title, description, duration } = req.body;
    
    // Validate duration
    if (duration <= 0) {
      return res.status(400).json({
        success: false,
        error: "Duration must be greater than 0"
      });
    }
    
    // Find existing test settings or create new one
    let testSettings = await AptitudeTest.findOne();
    
    if (testSettings) {
      testSettings.title = title;
      testSettings.description = description;
      testSettings.duration = duration;
      await testSettings.save();
    } else {
      testSettings = await AptitudeTest.create({
        title,
        description,
        duration
      });
    }
    
    res.status(200).json({ success: true, data: testSettings });
  } catch (error) {
    console.error("Error in bypass update:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit aptitude test results
router.post("/submit-test", verifyToken, async (req, res) => {
  try {
    const { scores, timeRemaining } = req.body;
    
    // Validate scores
    if (!scores || typeof scores !== "object") {
      return res.status(400).json({ success: false, error: "Invalid scores format" });
    }

    const requiredScores = ["math", "verbal", "logic"];
    for (const trait of requiredScores) {
      if (typeof scores[trait] !== "number" || scores[trait] < 0 || scores[trait] > 100) {
        return res.status(400).json({
          success: false,
          error: `Invalid score for ${trait}. Must be a number between 0 and 100.`
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
      timeRemaining: timeRemaining || 0,
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

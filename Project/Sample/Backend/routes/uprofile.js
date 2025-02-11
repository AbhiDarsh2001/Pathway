// profile.js (New file for profile routes)
const express = require('express');
const router = express.Router();
const User = require('../models/RegisterModel'); // Import UserModel
const PersonalityResult = require('../models/PersonalityResultModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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
    req.email = decoded.email; // Save email for further use
    next();
  });
};

// Single Profile route
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);
    const userId = decoded._id;

    // Fetch user data and both test results in parallel
    const [user, personalityResult] = await Promise.all([
      User.findById(userId),
      PersonalityResult.findOne({ userId }).sort({ createdAt: -1 })
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Combine user data with both test results
    const userData = user.toObject();
    
    // Add personality test results if they exist
    if (personalityResult) {
      userData.personalityResults = {
        scores: personalityResult.scores,
        createdAt: personalityResult.createdAt
      };
    }

    res.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Profile route
router.put('/', verifyToken, (req, res) => {
  const { name, phone, education, courses, marks } = req.body;

  User.findOneAndUpdate(
    { email: req.email },
    { name, phone, education, courses, marks },
    { new: true, runValidators: true } // Returns the updated document
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({ message: "Profile updated successfully", user });
    })
    .catch(error => res.status(500).json({ message: "Error: " + error.message }));
});

module.exports = router;

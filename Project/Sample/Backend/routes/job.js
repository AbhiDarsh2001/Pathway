const express = require('express');
const router = express.Router();
const jobModel = require('../models/JobModel'); // Correct model import



// POST route to create a new course
router.post('/', async (req, res) => {
  const { name, description, eligibility,industry } = req.body;

//   // Validate required fields
//   if (!name || !description || !eligibility || !industry) {
//     return res.status(400).json({ message: 'All required fields must be filled.' });
//   }

  try {
    // Create new Course document
    const newjob = new jobModel({
      name,
      description,
      eligibility,
      industry
    });

    // Save to database
    await newjob.save();

    // Return success response
    res.status(201).json({
      message: 'Job added successfully',
      job: newjob
    });

  } catch (error) {
    console.error('Error creating Job:', error.message);
    res.status(500).json({ message: 'Server error, unable to create course' });
  }
});

module.exports = router;
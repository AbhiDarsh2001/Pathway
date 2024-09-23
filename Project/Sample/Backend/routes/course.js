const express = require('express');
const router = express.Router();
const CourseModel = require('../models/CourseModel'); // Correct model import



// POST route to create a new course
router.post('/', async (req, res) => {
  const { name, description, eligibility, categories, job, entrance } = req.body;

  // Validate required fields
  if (!name || !description || !eligibility || !categories) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    // Create new Course document
    const newCourse = new CourseModel({
      name,
      description,
      eligibility,
      categories,
      job, // Ensure job and entrance are arrays
      entrance
    });

    // Save to database
    await newCourse.save();

    // Return success response
    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });

  } catch (error) {
    console.error('Error creating course:', error.message);
    res.status(500).json({ message: 'Server error, unable to create course' });
  }
});

module.exports = router;

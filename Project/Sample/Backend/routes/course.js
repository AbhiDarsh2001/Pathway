const express = require('express');
const router = express.Router();
const CourseModel = require('../models/CourseModel');

// POST route to create a new course
router.post('/', async (req, res) => {
  const { name, description, eligibility, category, job, entrance, duration } = req.body;

  // Check for required fields
  if (!name || !description || !eligibility || !category) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    // Check if course already exists
    const existingCourse = await CourseModel.findOne({ name });
    if (existingCourse) {
      return res.status(409).json({ message: 'Course already exists' });
    }

    // Create and save new course
    const newCourse = new CourseModel({ name, description, eligibility, category, job, entrance,duration });
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error.message);
    res.status(500).json({ message: 'Server error, unable to create course' });
  }
});

// GET route to get a course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error.message);
    res.status(500).json({ message: 'Server error, unable to fetch course' });
  }
});

// PUT route to update a course by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCourse = await CourseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error.message);
    res.status(500).json({ message: 'Server error, unable to update course' });
  }
});

// DELETE route to delete a course by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await CourseModel.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error.message);
    res.status(500).json({ message: 'Server error, unable to delete course' });
  }
});

module.exports = router;

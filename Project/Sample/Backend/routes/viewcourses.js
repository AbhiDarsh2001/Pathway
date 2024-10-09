const express = require('express');
const router = express.Router();
const courseModel = require('../models/CourseModel');

// Get all courses with populated category details
router.get('/all', async (req, res) => {
    try {
        const vcourse = await courseModel.find().populate('category'); // Populate category field
        res.json(vcourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get course by ID with populated category details
router.get('/:id', async (req, res) => {
    try {
        const vcourse = await courseModel.findById(req.params.id).populate('category'); // Populate category field
        if (!vcourse) return res.status(404).json({ message: 'Course not found' });
        res.json(vcourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const courseModel = require('../models/CourseModel');

// Get all Details

router.get('/all', async (req, res) => {
    try {
        const vcourse = await courseModel.find();
        res.json(vcourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Get by Id

router.get('/:id', async (req, res) => {
    try {
        const vcourse = await courseModel.findById(req.params.id);
        if (!vcourse) return res.status(404).json({ message: 'Course not found' });
        res.json(vcourse);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
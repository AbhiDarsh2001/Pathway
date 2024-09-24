const express = require('express');
const router = express.Router();
const jobModel = require('../models/JobModel');

// Get all Details

router.get('/all', async (req, res) => {
    try {
        const vjob = await jobModel.find();
        res.json(vjob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Get by Id

router.get('/:id', async (req, res) => {
    try {
        const vjob = await jobModel.findById(req.params.id);
        if (!vjob) return res.status(404).json({ message: 'Job not found' });
        res.json(vjob);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
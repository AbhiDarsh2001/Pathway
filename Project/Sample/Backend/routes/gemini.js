//routes/gemeini.js
const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../controllers/geminiapi');

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await chatWithGemini(message);
        res.json({ response });
    } catch (error) {
        console.error('Error in chat route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

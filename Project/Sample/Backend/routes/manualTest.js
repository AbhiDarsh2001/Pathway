const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/predict-manual', async (req, res) => {
    try {
        // Forward the request to the ML API
        const response = await axios.post(
            'http://localhost:5000/predict-manual',
            req.body
        );
        
        return res.json({
            success: true,
            careerRecommendation: response.data.careerRecommendation
        });
    } catch (error) {
        console.error('Error in manual prediction:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: 'Failed to get career prediction'
        });
    }
});

module.exports = router; 
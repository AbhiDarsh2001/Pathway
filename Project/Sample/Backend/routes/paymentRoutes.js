const express = require('express');
const router = express.Router();
const User = require('../models/RegisterModel');

// Endpoint to update payment status
router.post('/update-payment-status', async (req, res) => {
    console.log("update-payment-status");
    const { userId, paymentStatus } = req.body;

    try {
        console.log("userId", userId);
        console.log("paymentStatus", paymentStatus);
        const user = await User.findById(userId);
        console.log("user", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if(paymentStatus === 'success'){
            // Calculate expiration date (28 days from now)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 28);
            
            // Update user premium status with expiration date
            await User.findByIdAndUpdate(userId, {
                isPremium: true,
                paymentStatus: 'success',
                premiumExpiresAt: expirationDate
            });
            
            console.log("Premium membership activated until:", expirationDate);
        }

        await user.save();
        console.log("user", user);

        res.status(200).json({ 
            message: 'Payment status updated successfully', 
            isPremium: true,
            premiumExpiresAt: expirationDate
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router; 
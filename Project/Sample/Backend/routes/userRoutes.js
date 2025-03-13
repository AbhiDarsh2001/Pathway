const express = require('express');
const router = express.Router();
const User = require('../models/RegisterModel');

// Get user details
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if premium membership has expired
        const isPremiumValid = user.isPremium && 
                              user.premiumExpiresAt && 
                              new Date() < new Date(user.premiumExpiresAt);
        
        // If premium has expired, update the user record
        if (user.isPremium && !isPremiumValid) {
            user.isPremium = false;
            await user.save();
        }
        
        // Send back user data with updated premium status
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isPremium: isPremiumValid,
            premiumExpiresAt: user.premiumExpiresAt,
            // Include other user fields as needed
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;

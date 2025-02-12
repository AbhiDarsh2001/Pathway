const token = jwt.sign(
    { email: user.email, _id: user._id },
    process.env.JSON_WEB_TOKEN_SECRET_KEY,
    { expiresIn: '24h' } // Set a longer expiration time
); 

// Add a refresh token route
router.post('/refresh-token', async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ 
            success: false,
            message: 'Token is required' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);
        
        // Generate new token
        const newToken = jwt.sign(
            { email: decoded.email, _id: decoded._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true,
            token: newToken 
        });
    } catch (err) {
        res.status(401).json({ 
            success: false,
            message: 'Invalid token',
            expired: err.name === 'TokenExpiredError'
        });
    }
}); 
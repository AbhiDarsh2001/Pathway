const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require("cors");

const User = require('./models/RegisterModel.js');
const app = express();

// Middleware for CORS
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Allows cookies to be sent with the request
}));

// Load environment variables
dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pathway")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Middleware to parse JSON
app.use(bodyParser.json());

// Route to handle Google Auth and Sign Up
app.post('/authWithGoogle', async (req, res) => {
    const { name, email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const result = await User.create({
                name,
                email,
                password: ' ', // No password for Google auth
                isAdmin: false,
            });

            const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY, {
                expiresIn: '1h'
            });

            return res.status(200).send({
                user: result,
                token,
                msg: "User Registered and Logged in Successfully!",
            });
        } else {
            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY, {
                expiresIn: '1h'
            });

            return res.status(200).send({
                user: existingUser,
                token,
                msg: "User Logged in Successfully!",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: "An error occurred",
            error: error.message,
        });
    }
});

// Route to handle Signup
app.post('/signup', async (req, res) => {
    console.log("hii");
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please fill all the fields.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
        });

        await newUser.save();

        res.status(200).json({
            msg: 'User registered successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// Route to handle Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Create and send JWT
        const token = jwt.sign({ _id: user._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

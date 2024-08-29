const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { User } = require('./models/RegisterModel.js');
const cors=require("cors");
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
// Load environment variables
dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI ||"mongodb://localhost:27017/Sample")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));



app.use(bodyParser.json());

// Route to handle Google Auth and Sign Up
app.post('/authWithGoogle', async (req, res) => {
    const { name, phone, email } = req.body;

    try {
        const existingUser = await User.findOne({ email:email });

        if (!existingUser) {
            // Create a new user if not existing
            const result = await User.create({
                name: name,
                phone: phone,
                email: email,
                password: ' ', // No password for Google auth
                isAdmin: false,
            });

            const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY, {
                expiresIn: '1h' // Token expiration time
            });

            return res.status(200).send({
                user: result,
                token,
                msg: "User Registered and Logged in Successfully!",
            });
        } else {
            // User already exists, just generate a token
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
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before saving
        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name : name,
            email : email,
            phone:' ',
            password: password,
            isAdmin: false,
        });

        await newUser.save();

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.status(200).json({
            msg: 'User registered successfully',
            user: newUser,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});



app.listen(8080,()=>{
    console.log("server connected");
})

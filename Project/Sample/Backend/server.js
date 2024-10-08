const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require("cors");
const nodemailer = require('nodemailer');
const User = require('./models/RegisterModel.js');
const app = express();




//import Routes
const CourseRoute = require('./routes/course.js')
const JobRoute = require('./routes/job.js')
const Viewjob = require('./routes/viewjobs.js')
const addmanager = require('./routes/addmanager.js');
const Viewcourse = require('./routes/viewcourses.js')
const DelCourseRoute = require('./routes/delcourse');
const DelJobRoute = require('./routes/deljob.js');
const ViewManager = require('./routes/viewmanager.js');
const ViewUserPro = require('./routes/uprofile.js');
const Ueditpro = require('./routes/uprofileupdate.js');
const Category = require('./routes/categoryRoutes.js');

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
                name:name,
                email:email,
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

        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: password,
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
        const validPassword = password;
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

app.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    console.log(email);

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({ error: true, msg: 'Email id not registered' });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpiration = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Send email with nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Password Reset Code',
        text:`Your password reset code is ${resetCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ error: true, msg: 'Error sending email' });
        } else {
            return res.status(200).send({ error: false, msg: 'Verification code sent to your email.' });
        }
    });
});

app.post('/verifycode', async (req, res) => {
    const { email, code } = req.body;
    console.log(code);

    const user = await User.findOne({ email, resetCode: code, resetCodeExpiration: { $gt: Date.now() } });
    if (!user) {
        return res.status(400).send({ error: true, msg: 'Invalid or expired code' });
    }

    res.status(200).send({ error: false, msg: 'Code verified' });
});

app.post('/resetpassword', async (req, res) => {
    const { email, password } = req.body;
    console.log(password);

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({ error: true, msg: 'Email not found' });
    }

    user.password = password; 
    user.resetCode = undefined;
    user.resetCodeExpiration = undefined;
    await user.save();

    res.status(200).send({ error: false, msg: 'Password has been reset' });
});


// use routes

app.use('/course', CourseRoute);
app.use('/job', JobRoute);
app.use('/viewjob',Viewjob);
app.use('/addmanager', addmanager);
app.use('/viewcourse',Viewcourse);
app.use('/delcourse', DelCourseRoute);
app.use('/deljob',DelJobRoute);
app.use('/viewmanager',ViewManager);
app.use('/vuprofile',ViewUserPro);
app.use('/updateProfile',Ueditpro);
app.use('/category',Category);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

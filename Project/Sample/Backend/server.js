process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && 
      warning.message.includes('punycode')) {
    return; // Ignore punycode deprecation warning
  }
  // Log other warnings
  console.warn(warning.name, warning.message);
});

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const nodemailer = require("nodemailer");
const User = require("./models/RegisterModel.js");
const app = express();

// Import Routes
const CourseRoute = require("./routes/course.js");
const JobRoute = require("./routes/job.js");
const Viewjob = require("./routes/viewjobs.js");
const addmanager = require("./routes/addmanager.js");
const Viewcourse = require("./routes/viewcourses.js");
const DelCourseRoute = require("./routes/delcourse");
const DelJobRoute = require("./routes/deljob.js");
const ViewManager = require("./routes/viewmanager.js");
const ViewUserPro = require("./routes/uprofile.js");
const Ueditpro = require("./routes/uprofileupdate.js");
const categoryRoutes = require("./routes/categoryRoutes");
const SearchCourse = require("./routes/searchCourse.js");
const blogRoutes = require("./routes/blogRoutes");
const managerModel = require("./models/AddManager.js");
const reportRoutes = require("./routes/reportRoutes.js");
const ViewReportRoutes = require("./routes/Reportroute.js");
const InstituteRoutes= require("./routes/institute.js");
//const chatBot=require("./routes/chatBot.js");
const TestRoutes=require("./routes/Test.js");
const gemini=require("./routes/gemini.js");
const questionRoutes = require("./routes/questionRoutes");

// Middleware for CORS

// LOCAL HOST
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
//SERVER
// app.use(
//   cors({
//     origin: "https://pathway-1-frontend.onrender.com",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );


// Load environment variables
dotenv.config();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Blog routes
app.use("/api/blogs", blogRoutes);

// Routes for user authentication and password reset
app.post("/authWithGoogle", async (req, res) => {
  const { name, email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const result = await User.create({
        name,
        email,
        password: " ",
        isAdmin: false,
      });
      const token = jwt.sign(
        { email: result.email, id: result._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).send({
        user: result,
        token,
        msg: "User Registered and Logged in Successfully!",
      });
    } else {
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).send({
        user: existingUser,
        token,
        msg: "User Logged in Successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ msg: "An error occurred", error: error.message });
  }
});

// Signup and login routes
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please fill all the fields." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters long." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const newUser = new User({ name, email, password, role: 1 });
    await newUser.save();
    res.status(200).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ... existing code ...


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the credentials match the static admin credentials
    if (email === "careerpathwayadmin@gmail.com" && password === "admin@123") {
      return res.status(200).json({
        message: "Admin Login Successful",
        data: {
          email,
          role: "admin",
          name: "Admin",
          userId: "admin-id", // A placeholder ID for the admin
        },
        token: "admin-token-placeholder", // You may choose to generate a token if needed
      });
    }

    // Check for User or Manager
    const user = await User.findOne({ email });
    const manager = await managerModel.findOne({ email });

    if (!user && !manager) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    let currentUser, role;

    if (manager) {
      const isMatch = await bcrypt.compare(password, manager.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      currentUser = manager;
      role = manager.role;
    } else if (user) {
      if (user.password !== user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      currentUser = user;
      role = user.role;
    }

    const token = jwt.sign(
      { _id: currentUser._id, email: currentUser.email },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login Successful",
      data: {
        email: currentUser.email,
        role: role,
        name: currentUser.name,
        userId: currentUser._id,
      },
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
});


// Password reset routes
app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ error: true, msg: "Email id not registered" });
  }
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  user.resetCode = resetCode;
  user.resetCodeExpiration = Date.now() + 3600000;
  await user.save();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password Reset Code",
    text: `Your password reset code is ${resetCode}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ error: true, msg: "Error sending email" });
    } else {
      return res
        .status(200)
        .send({ error: false, msg: "Verification code sent to your email." });
    }
  });
});

app.post("/verifycode", async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({
    email,
    resetCode: code,
    resetCodeExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .send({ error: true, msg: "Invalid or expired code" });
  }
  res.status(200).send({ error: false, msg: "Code verified" });
});

app.post("/resetpassword", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ error: true, msg: "Email not found" });
  }
  user.password = password;
  user.resetCode = undefined;
  user.resetCodeExpiration = undefined;
  await user.save();
  res.status(200).send({ error: false, msg: "Password has been reset" });
});

// Use routes
app.use("/course", CourseRoute);
app.use("/job", JobRoute);
app.use("/viewjob", Viewjob);
app.use("/addmanager", addmanager);
app.use("/viewcourse", Viewcourse);
app.use("/delcourse", DelCourseRoute);
app.use("/deljob", DelJobRoute);
app.use("/viewmanager", ViewManager);
app.use("/vuprofile", ViewUserPro);
app.use("/updateProfile", Ueditpro);
app.use("/category", categoryRoutes);
app.use("/", SearchCourse);
app.use("/blog", blogRoutes);
app.use("/report", reportRoutes);
app.use('/viewreport',ViewReportRoutes);
app.use('/institute',InstituteRoutes);
//app.use('/chatBot',chatBot);
app.use('/test', TestRoutes);
app.use('/personal', questionRoutes);



app.use('/gemini',gemini);

// Example route for categories and subcategories
app.get("/categories/:categoryId/subcategories", async (req, res) => {
  const { categoryId } = req.params;
  // Fetch subcategories based on categoryId from your database
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/test', (req, res) => res.json({ message: 'API is working' }));

// Add these middleware configurations if not already present
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

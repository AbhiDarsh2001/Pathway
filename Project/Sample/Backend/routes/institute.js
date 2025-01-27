// routes/institute.js
const express = require("express");
const upload = require("../config/multerStorage");
const Teacher = require("../models/institute");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to register a teacher/institute
router.post(
  "/register",
  upload.fields([
    { name: "idCard", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { firstname, email, phone, founded, address, altPhone, specialization } = req.body;
      const files = req.files; // Files uploaded by Multer

      // Save the uploaded file URLs
      const teacher = new Teacher({
        firstname,
        email,
        phone,
        altPhone,
        founded,
        address,
        specialization,
        idCard: files.idCard ? files.idCard[0].path : null,
        photo: files.photo ? files.photo[0].path : null,
        resume: files.resume ? files.resume[0].path : null,
      });

      await teacher.save();

      const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Registration successful",
        text: `Hello, ${firstname},\n\nYour registration was successful! We are thrilled to have you on board.\n\nBest regards,\nThe CareerPathway Team`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).json({
        success: true,
        message: "Registration successful",
        teacher: teacher, // Include the teacher details in the response
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Error during registration", error });
    }
  }
);

// Route to fetch all registered teachers/institutes
router.get("/all", async (req, res) => {
  try {
    const teachers = await Teacher.find(); // Fetch all teacher records
    res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch",
      error,
    });
  }
});

// get all instutes

router.get("/teachersreq", async (req, res) => {
  try {
      const teachers = await Teacher.find({active:false});
      res.status(200).json(teachers);
  } catch (error) {
      res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
});

module.exports = router;

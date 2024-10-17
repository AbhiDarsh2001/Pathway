// routes/blogRoutes.js
const express = require('express');
const Blog = require('../models/BlogModel');
const multer = require('multer'); 
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ensure 'uploads/' folder exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Add a new blog
router.post('/add', upload.single('image'), async (req, res) => {
  console.log(req.body);

  try {
    const { title, content, author } = req.body;
    const image = req.file ?  `/uploads/${req.file.filename}` : '';

    const newBlog = new Blog({ title, content, author, image });
    await newBlog.save();

    res.status(201).json({ message: 'Blog added successfully', blog: newBlog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error adding blog' });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name');
    res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching blogs' });
  }
});

module.exports = router;

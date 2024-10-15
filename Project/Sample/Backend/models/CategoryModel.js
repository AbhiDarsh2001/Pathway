// CategoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // To avoid duplicate categories
        trim: true
    },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

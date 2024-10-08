// categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // To avoid duplicate categories
        trim: true
    },
    // description: {
    //     type: String,
    //     required: false // Optional field for additional info
    // }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

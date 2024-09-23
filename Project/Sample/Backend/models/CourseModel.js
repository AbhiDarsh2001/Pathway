const mongoose = require('mongoose');
    const courseSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true, // Name is mandatory
            trim: true // Removes leading/trailing spaces
        },
        description: {
            type: String,
            required: true,
            minlength: 10 // Ensure description is not too short
        },
        eligibility: {
            type: String,
            required: true
        },
        categories: {
            type: String,
            enum: ['PG', 'UG', 'Professional', 'Non-professional'],
            required: true
        },
        job: {
            type: [String],
        },
        entrance: {
            type: [String],
        // },
        // like: {
        //     type: Number,
        // },
        // Comments: {
        //     type: Array
        } 
    });

    const coursemodel = mongoose.model("course", courseSchema);
    module.exports = coursemodel;
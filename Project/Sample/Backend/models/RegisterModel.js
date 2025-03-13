const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
        
    },

    phone : {
        type : Number,
        required:false,
    },
    role: {
        type: Number,
        required: true,
    },
    resetCode:{
        type:String,
        default:''
    },
    resetCodeExpiration:{
        type:Date,
        default:Date.now
    },

    education: {
        type: String,
        enum:[ '10','+2','Undergraduate', 'PostGraduate'],
        required: false
    },

    courses:{
        type: [String],
        default: []
    },
    marks: {
        tenthMark: {
            type:Number,
            default:0
        },
        twelthMark:{
            type:Number,
            default:0
        },
        degreeMark:{
            type:Number,
            default:0
        },
        pgMark:{
            type:Number,
            default:0
        }

    },
    isPremium: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },



    

}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
module.exports = User;

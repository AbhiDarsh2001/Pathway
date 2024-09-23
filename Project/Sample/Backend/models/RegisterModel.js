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
    isAdmin: {
        type: Boolean,
        default: false,
    },
    resetCode:{
        type:String,
        default:''
    },
    resetCodeExpiration:{
        type:Date,
        default:Date.now
    }
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
        },
password:{
        type:String,
         },
phone:{
        type:String,
            },
     isAdmin:{
        type:Boolean,
        default:false
            }
},{ versionKey: false });

exports.User = mongoose.model('usersses',userSchema);
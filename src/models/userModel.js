const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    employeeId:Number,
    userName:String,
    name:{
        type:String,
        required:true,
        trim:true,
        // maxlength:7
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    mobile:{
        type:Number,
        required:true,
        maxlength:10
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    confirmPassword:{
        type:String,
        required:true,
        trim:true,
    },
    token:{   
         type:String
    }
},{timestamps:true});

module.exports = mongoose. model('user', userSchema)
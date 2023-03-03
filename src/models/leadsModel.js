const mongoose = require('mongoose');

const leadsSchema = new mongoose.Schema({
    employeeId: {
        type: Number,
        required:true,
        trim:true
    },
    userName:{
        type:String,
        required:true,
        trim:true
    },
    assignTo: {
        type: String,
        required:true,
        trim:true
    },
    status: {
        type: String,
        trim:true,
        enum:["Allocated", "Pending", "Not Intrested", "Completed"],
        default: "Allocated"
    },
    work: {
        type: String,
        default: null
    },
    reminder: {
        type: Date,
        default: null
    },
    tasks: {
        type: [],
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

module.exports = mongoose.model('leads', leadsSchema);
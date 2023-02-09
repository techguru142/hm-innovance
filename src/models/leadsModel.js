const mongoose = require('mongoose');

const leadsSchema = new mongoose.Schema({
    employeeId: {
        type: String
    },
    assignTo: {
        type: String
    },
    status: {
        type: String,
        default: "Accepted"
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
        type: []
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

module.exports = mongoose.model('leads', leadsSchema);
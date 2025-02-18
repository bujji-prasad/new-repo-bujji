const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 50,  
        required: true   
    },
    description: {
        type: String,
        maxlength: 100  
    },
    assignedTo: {
        type: String,
        required: true 
    },
    dueDate: {
        type: Date,
        required: true 
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], 
        required: true  
    },
    status: {
        type: String,
        enum: ['Pending', 'In-progress', 'Completed'],  
        required: true, 
        default: 'Pending' 
    },
    markasRead: {
        type: Boolean,
        default: false  
    }
});


const Task = mongoose.model('Task', taskSchema , "userTasks");

module.exports = Task;

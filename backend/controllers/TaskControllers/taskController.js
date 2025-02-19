const mongoose = require("mongoose")
const Task = require("../../model/taskModels/taskmodel")


const addTask = async (req,res) => {
    const {title,description,assignedTo,dueDate,priority,status,markasRead} = req.body
    try{
        const newTask = new Task({
            title,
            description,
            assignedTo,
            dueDate,
            priority,
            status,
            markasRead
        })
        await newTask.save()
        res.status(200).json({ message: "Task added successfully in backend", task: newTask });
    }
    catch(error) {
        console.log(error)
        console.log("Error while creating the Task:", error);
        return res.status(500).json({
            message: "Error while creating the Task",
            errorMsg: error._message || error,
        });
    }
}

const getTasks = async (req,res) => {
    try{
        console.log("get tasks called")
        const tasks = await Task.find();
        console.log(tasks)
        res.status(200).json({message : "got tasks" , tasks : tasks})
    }
    catch(error) {
        console.error('Error retrieving Task details:', error);
        return res.status(500).json({ message: 'Error retrieving Task details', details: error.message });  
    }
}

const getTaskById = async (req,res) => {
    try{
        const {taskId} =req.params
        const task = await Task.findOne({_id : taskId})
        console.log(`task with id insdie gettaskwith id : ${taskId}`)
        res.status(200).json({message : "got task to edit" , task : task})
    }
    catch(error){
        console.error('Error while getting the task:', error);  
        return res.status(500).json({ message: 'Error while getting the task', details: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        console.log(`Task ID to delete: ${taskId}`);

        const deletedTask = await Task.findByIdAndDelete(taskId);  

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });  
        }

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });  
    } catch (error) {
        console.error('Error while deleting the task:', error); 
        return res.status(500).json({ message: 'Error while deleting the task', details: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true, runValidators: true }); 

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        console.error('Error updating task:', error); 
        res.status(500).json({
            message: 'Error updating the task',
            error: error.message 
        });
    }
};



module.exports = {addTask ,  getTasks ,deleteTask , getTaskById , updateTask};
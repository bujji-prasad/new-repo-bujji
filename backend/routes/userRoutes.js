const express = require("express");
const router = express.Router();

const { createUser , loginUser ,getUserDetails,getLoginUserDetails,verifyToken} = require("../controllers/userController");
const {addTask ,getTasks,deleteTask , getTaskById ,updateTask} = require("../controllers/TaskControllers/taskController")

router.post("/add", createUser);
router.post("/login",loginUser);
router.get("/users" ,getUserDetails );
router.post("/addTask" ,addTask);
router.get("/tasks" , getTasks);
router.delete("/deleteTask/:taskId",deleteTask)
router.get("/task/:taskId" , getTaskById)
router.put("/taskEdit/:taskId" , updateTask)
router.get("/user" ,getLoginUserDetails)



module.exports = router;

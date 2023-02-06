const Users = require('../models/userModel')
const mongoose = require('mongoose')
const GridFsStorage = require('multer-gridfs-storage');
const taskModel = require('../models/taskModel');
var upload = multer({
    storage
  });


let bucket;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
  });
  console.log(bucket);
});

const storage = new GridFsStorage({
    url: mongouri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "newBucket"
        };
        resolve(fileInfo);
      });
    }
  });

  // admin asign a task to Users by their _id
const addTask = async(req,res)=>{
const emplyId = req.params.emplyId
const taskFile = req.files
const newTask = req.body
const{taskName, descriptions, status} = newTask
const savedTask = await taskModel.create({
    taskName:taskName,
    descriptions:descriptions,
    file:taskFile,
    Users:emplyId,
    status:status
})
const userAssign = await Users.findOne({ "_id": id })
  const taskList = [...userAssign.task, response]
  console.log(taskList)
  await Users.findByIdAndUpdate({ "_id": id }, { $set: { "task": taskList } },{new:true})
res.status(201).send({status:true, Message:"Task added successfully"})
}

// update the task status by Users

const updateStatus = async(req,res)=>{
    let message = req.body.message;
    let id = req.params.id
    const Users = await Users.findOne({ "_id": req.Users._id })
  
    let task = Users.task
  
    var index = task.map(object => object._id.valueOf()).indexOf(id)
    var j = task[index].status
    let update = await Users.findByIdAndUpdate({ "_id": req.Users._id }, { $set: { [`task.${index}.status`]: `${message}` } })
    await Task.updateOne({ "_id": id }, { $set: { "status": `${message}` } })
    res.send(update)
}

// Showing all user task

const getUserTask = async(req,res)=>{
  let response = await Users.find({ "_id": req.Users._id })
  let task = response[0].task
  var index = task.map(object => object._id.valueOf()).indexOf(req.params.id)
  bucket.openDownloadStreamByName(response[0].task[index].file)
    .pipe(res);
}

const getSingleUserTask = async(req,res)=>{
    let response = await Users.findOne({ "_id": req.Users._id })
    res.send({
      _id: response._id,
      name: response.name,
      email: response.email,
      mobile: response.mobile,
      task: response.task
    })
}



module.exports = {addTask,updateStatus,getUserTask,getSingleUserTask}
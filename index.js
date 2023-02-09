const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/routes/route');
const socket = require('socket.io');
const multer = require('multer')
const app = express()
mongoose.set('strictQuery', false);
app.use(express.json());
app.use(multer().any())


const connection_url = "mongodb+srv://guru:Guru7563@cluster0.yc1ntls.mongodb.net/?retryWrites=true&w=majority"
const PORT = process.env.PORT || 4000;

mongoose.connect(connection_url, {
    useNewUrlParser:true
})
.then(()=> console.log("Database is connected"))
.catch((err)=> console.log(err))

app.use('/', route);

const server = app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})

const io = socket(server, {
    cors: {
      origin: "http://localhost:4000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });

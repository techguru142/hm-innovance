const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/routes/route');
const session = require('express-session')
const app = express();
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 },resave:false,saveUninitialized:true}))

mongoose.set('strictQuery', false);
app.use(express.json());



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



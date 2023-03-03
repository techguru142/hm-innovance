const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/routes/route');
require('dotenv').config()
const app = express();
mongoose.set('strictQuery', false);
app.use(express.json());

mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser:true
})
.then(()=> console.log("Database is connected"))
.catch((err)=> console.log(err))

app.use('/', route);

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})



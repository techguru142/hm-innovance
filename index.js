const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/routes/route');
const app = express();

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



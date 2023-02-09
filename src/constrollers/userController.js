const { isValidRequest, isValidEmail, isValidPwd, isValidPhone } = require('../utills/validation')
const Users = require('../models/userModel');
const conversation = require('../models/conversationModel');
const Admin = require('../models/adminSchema')
const bcrypt = require('bcrypt');
const cookie = require('cookie');



// register Users

const userRegister = async(req,res)=>{
   try {
    const newUser = req.body
    let {name, email, mobile, password} = newUser
    
    if(!name || !email || !mobile || !password || !isValidRequest(newUser)){
        return res.status(400).send({status:false, Message:"All fields are required"})
    }
    const isUsed = await Users.findOne({email:email})
    if(isUsed){
        return res.status(409).send({status:false, Message:"This email is already used"})
    }
    if(!isValidEmail(email)){
        return res.status(400).send({status:false, Message:`Invalalid email ${email}`})
    }else if(!isValidPhone(mobile)){
        return res.status(400).send({status:false, Message:`Invalid mobile Number ${mobile}`})
    }else if(!isValidPwd(password)){
        return res.status(400).send({status:false, Message:"Password should be strong"})
    }
    password = await bcrypt.hashSync(newUser.password, 10)
    const savedUser = await Users.create(newUser)
    res.status(201).send({status:true, savedUser})

   } catch (error) {
    res.status(500).send({status:false, Error:error.message})
   }
};

const userLogin = async(req,res)=>{
    const registeredUser = req.body
    const{email,password} = registeredUser
    if(!email || !password){
        return res.status(400).send({status:false, message:"Email and Password is required"})
    }
    const isValidUser = await Users.findOne({email:email})
    if(!isValidUser){
        res.status(403).send({status:false, message:"Invalid email or password"})
    }
    const validateUser = await bcrypt.compare(password, isValidUser.password);
    if (!validateUser) {
        return res
            .status(401)
            .send({ status: false, message: "Incorrect password" });
    }
    const senderId = isValidUser._id.valueOf()
    const admin = await Admin.find()
    const adminId = admin[0]._id.valueOf()
    const addConversation = await conversation.create({members:[senderId, adminId]})
    const token = jwt.sign(
        {
            userId:isValidUser._id
        },
        "if you challenge me, I can beet you"
    );
    if(isValidUser.tokens ===  undefined || isValidUser.tokens == ""){
        let loggedInUser = await Users.findOneAndUpdate({email:email},{tokens:token})
        res.setHeader("x-api-key", token);
       res.cookie("access_token", token, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production",
      })
        }else{
            return res.status(401).send("You are already loggedin")
        }

    return res.status(200).send({status:true,message:"Login successfull!"})
}

const logoutUser = async(req,res)=>{
    try {
        const token = req.cookies.access_token;
        const isLoggedIn = await Users.findOneAndUpdate({tokens:token},{tokens:""}, {new:true})
        return res.clearCookie("access_token", token).status(200).send("logOut successfully")
      } catch (error) {
        res.send(error)
      }
}

const getAllUser = async (req,res)=>{
    const data = await Users.find()
    res.send(data)
}

const allocateLeads = async(req,res)=>{
let clientLeads = req.body.task
let arr = []
clientLeads.map((ele)=>{
    let obj = {
        name:ele.name,
        email:ele.name,
        message:ele.message
    }
    arr.push(obj)
    
});
let numberOfTask = arr.length;
let employee = await Users.find()//.count()
let numberOfEmp = employee.length;
let splitTask = numberOfTask/numberOfEmp;
let newTask = [];
var id = 0;
for(let i =0; i<numberOfTask; i++){
    // let employeeName = employee.map((ele)=>{
    //     return ele.name
    // })
    console.log(employee[i]._id  )
    let userId = id%100;
    if(splitTask%1 !==0){
        newTask.push(arr[i])
        if(newTask.length ==1){
            await Users.findOneAndUpdate({id:userId},{$push:{task:newTask}})
        }
    }else{
        newTask.push(arr[i])
    if(newTask.length == splitTask){
        await Users.findOneAndUpdate({id:userId},{$push:{task:newTask}})
        id++;
        newTask =[]
    }
    }
}

let userTask = await Users.find()
res.send({task:userTask})
};

const reAllocateTask = async(req,res)=>{
let userId = req.body
}
//let arr = [{"task":1},{"task":2},{"task":3},{"task":5},{"task":6},{"task":7},{"task":8},{"task":9},{"task":10},{"task":11},{"task":12}]


module.exports = {userRegister,userLogin,logoutUser, getAllUser, allocateLeads};
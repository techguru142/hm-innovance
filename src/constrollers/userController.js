const Users = require('../models/userModel')
const Admin = require('../models/adminModel');

const bcrypt = require('bcrypt');
const cookie = require('cookie');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');



const isValidPwd = function (Password) {                                                  
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
}

const isEmail = function (email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }

    return false;
}
const userRegister = async (req, res) => {
    try {
        const userInfo = req.body
        const { name, email, mobile, password } = userInfo

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "please enter a data in request body" })

        /*------------------------------Validation for name--------------------------------*/
        if (!name)
            return res.status(400).send({ status: false, msg: "Name is missing" })

        if (!isNaN(name)) return res.status(400).send({ status: false, msg: " Please enter valid userName as a String" });

        /*------------------------------Validation for Email--------------------------------*/
        if (typeof email !== "string") return res.status(400).send({ status: false, msg: " Please enter  email as a String" });
        if (!isEmail(email)) { return res.status(400).send({ status: false, msg: "Enter valid Email." }) }

        const emailUnique = await Users.findOne({ email: email })
        if (emailUnique) {
            return res.status(400).send({ status: false, msg: "eamil is alreday exist" })
        }

        /*------------------------------Validation for Mobile--------------------------------*/

        if (!mobile)
            return res.status(400).send({ status: false, msg: "mobile is missing" })

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
            return res.status(400).send({ status: false, msg: " please enter Phone_number" })
        }
        /*------------------------------Validation for password--------------------------------*/

        if (!password)
            return res.status(400).send({ status: false, msg: "password is missing" })
        if (!(password.length > 6 && password.length < 16)) return res.status(400).send({ status: false, msg: "password should be greater than 6 and less then 16 " })


        if (!isValidPwd(password)) { return res.status(400).send({ status: false, msg: "Enter valid password." }) }
        //-----------[Password encryption]
        const bcryptPassword = await bcrypt.hash(password, 10)
        userInfo.password = bcryptPassword

        const saveduserInfo = await Users.create(userInfo)
        res.status(200).send({ status: true, saveduserInfo })
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



const userLogin=async(req,res)=>{
    try {
        
        let validUser=await Users.findOne({"email":req.body.email})
        if(!validUser){
        res.status(500).json("invalid user")
         return;
        }
        else{
            if(await bcrypt.compare(req.body.password,validUser.password)){
                let jwtSecretKey = "abvd123";
                let data = {
                   
                    userId: validUser._id,
                }
              
                const token = jwt.sign(data, jwtSecretKey);
            //   res.cookie("token",token)


             // req.session.token =token;
            // let setinsessons=req.session.token
           //  console.log(setinsessons)
          //   console.log(setinsessons)
         // req.session.save();
             // sessionStorage.setItem('token',token);

            
                res.send({
                    name:validUser.name,
                    email:validUser.email,
                    mobile:validUser.mobile,
                    token:token
                })
            }else{
                res.status(500).send({status:false, message:"invalid credentials"})
            }
        }
    } catch (error) {
        res.status(500).json("err")
    } 
}



const logoutUser = async (req, res) => {
    try {
       res.clearCookie("token")

    //res.sessionStorage.destroy('token')
    res.json("sucessful logout")
    } catch (error) {
        res.status(500).send(error)
    }
}

const getAllUser = async (req, res) => {
    const data = await Users.find()
    res.send(data)
}

const userEmailsend=async (req,res)=>{
    let email=req.body.eamil;
    let data=await Users.findOne({ email: email })

    if(!data){
     return res.status(400).send({ status: false, msg: "Plz enter valid email ID" })
    }
 
    var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: "pspkbabul@gmail.com",
       pass: "lfohzyyhxncujpbl"
     }
   });
   let otpnum= Math.floor(1000+Math.random()*9000)
    let addotp = await Users.findOneAndUpdate({email:email},{$set:{otp:otpnum}})
    
 //    console.log(addotp)
 //   console.log(otp)
      var mailOptions = {
     from: "pspkbabul@gmail.com",
     to: "gurucharan@hminnovance.com",
     subject:"Reset Password OTP",
     text: `Your reset password OTP is ${otpnum}`
   };
 
 
   transporter.sendMail(mailOptions, function(error,info){
     if (error) {
       res.status(403).send(error);
     } else {
      res.status(200).send(info)
     }
   });
 }

const Userverfiypassword = async (req, res) => {
    try{
   let otp=req.body.otp;
   let email=req.body.email;
   if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "please enter a data in request body" })
   let isuser=await Users.findOne({email:email})
   if(!isuser) 
   return res.status(404).send({status:false,message:"Account not found for this email"})
   if(otp!==isuser.otp){
    return res.status(403).send({status:false, message:"Invalid otp"})
}else{
    return res.send({status:true, message:"OTP verified successfully"})
}
}
catch (err) { return res.status(500).send({ status: false, msg: err.massage }) 
}
}

// Users
   
const Userchangepassword= async (req, res) => {

    try{
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "please enter a data in request body" })
        let email=req.body.email;
        let password=req.body.password;
        if(!password){
            return res.status(400).send({ status: false, msg: "password is missing" })
        }
        if (!password)
        return res.status(400).send({ status: false, msg: "password is missing" })
       if (!(password.length > 6 && password.length < 16)) return res.status(400).send({ status: false, msg: "password should be greater than 6 and less then 16 " })
        //-----------[Password encryption]
        const bcryptPassword = await bcrypt.hash(password, 10)
        let changepassword=await Users.findOneAndUpdate({email:email},
            {$set:{password:bcryptPassword,Timewhenyouupadted: new Date()}}
            )
           res.status(200).send({ status: true, data: `succesfully password updated ${changepassword}`});
        }
        catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
   
}

const Usergenereate= async (req, res) => {
    try{
        let Usersid=req.body.employerid
        if (!isNumberstring(Usersid)) { return res.status(400).send({ status: false, msg: "Enter valid employer Id it may consists number or string." }) }
        
        const uniqueUsersId = await Users.findOne({Usersid: Usersid })
        if ( uniqueUsersId) {
            return res.status(400).send({ status: false, msg: "This emplpyer Id is already Present " })
        }
        const savedUserId = await Users.create({Usersid:Usersid})
        res.status(200).send({ status: true,savedUserId})


    }
 catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
}

module.exports = { userRegister, userLogin, logoutUser, getAllUser,Userverfiypassword,Userchangepassword,Usergenereate,userEmailsend};

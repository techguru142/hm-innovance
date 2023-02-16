
/*------------------------------Task for 3 feb--------------------------------*/
const adminModel = require('../models/adminModel');
const employerIdModel=require('../models/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const cookie = require('cookie')

/*----------------------------------------adminRegister api------------------------------------------*/
const isValidPwd = function (Password) {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
}

const isEmail = function (email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }

    return false;
}


function isNumberstring(str) {
    if (typeof str != "string") return false // we only process strings!
  if(typeof str == "string"){
      if((str.match( /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/))){
          return true
      }
      else{
          return false
      }
  }
  return false
  }

const adminRegister = async (req, res) => {
     try {
        const adminInfo = req.body
        const { name, email, mobile, password } = adminInfo



        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "please enter a data in request body" })

        /*------------------------------Validation for name--------------------------------*/
        if (!name)
            return res.status(400).send({ status: false, msg: "Name is missing" })

        if (!isNaN(name)) return res.status(400).send({ status: false, msg: " Please enter Name as a String" });

        /*------------------------------Validation for Email--------------------------------*/
      if (typeof email !== "string") return res.status(400).send({ status: false, msg: " Please enter  email as a String" });
        if (!isEmail(email)) { return res.status(400).send({ status: false, msg: "Enter valid Email." }) }

        const emailUnique = await adminModel.findOne({ email: email })
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
        adminInfo.password = bcryptPassword

        const savedAdminInfo = await adminModel.create(adminInfo)
        res.status(200).send({ status: true, savedAdminInfo })
    }catch(err){
        return res.status(500).send({status:false, error: err.message})
    }
    }
    




/*----------------------------------------adminLogin  api------------------------------------------*/

const adminLogin = async (req, res) => {
    try {

        let data = req.body
        let { email, password } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })

              /*------------------------------Validation for Email--------------------------------*/

        if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
        if (!isEmail(email)) { return res.status(400).send({ status: false, msg: "Enter valid Email." }) }

        if (typeof email !== "string") return res.status(400).send({ status: false, msg: " Please enter  email as a String" });

  
        if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
    
        const Login = await adminModel.findOne({ email })      /////store entire schema
        if (!Login) return res.status(400).send({ status: false, message: 'Not a register email Id' })

        //----------[Password Verification]
        let PassDecode = await bcrypt.compare(password, Login.password)   ///////login entire schrema
        if (!PassDecode) return res.status(401).send({ status: false, message: 'Password not match' })
    
        //----------[JWT token generate]
        let token = jwt.sign({
            userId: Login._id.toString()       //to remove Object_id
        }, "admin panel", { expiresIn: '50d' })

        res.setHeader("x-api-key", token)
        res.cookie("Access_token", token)
         
        return res.status(200).send({ status: true, message: 'Admin login successfull', data: { userId: Login._id, token: token } })

    }
    catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
}






/*------------------------------Task for 4 feb--------------------------------*/


/*----------------------------------------adminreset api------------------------------------------*/
const adminreset = async (req, res) => {
 try {
        let password=req.body.password;
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "please enter a data in request body" })
    if(!password){
        return res.status(400).send({ status: false, msg: "password is missing" })
    }
//-----------[Password encryption]----------------
        const bcryptPassword = await bcrypt.hash(password, 10)
        adminModel.password = bcryptPassword
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
        let decodedToken = jwt.verify(token, "admin panel")
        let adminId=decodedToken.userId
        // console.log(adminId);
        let updatepassword=await adminModel.findOneAndUpdate({_id:adminId},{password:bcryptPassword});
         res.status(200).send({ status: true, data: `finally password is updated ${updatepassword}`  });
    }
 catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
}

/*----------------------------------------adminforget api------------------------------------------*/




/*----------------------------------------admiemailsend  api------------------------------------------*/



const admiemailsend = async (req, res) => {   
     let data=await adminModel.findOne({ email: req.body.email })

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
  let otpnum= Math.floor((Math.random()*1000)+1)
   let addotp = await adminModel.findOneAndUpdate({name:"Admipagal7"},{$set:{otp:otpnum}})
   
//    console.log(addotp)
//   console.log(otp)
     var mailOptions = {
    from: "pspkbabul@gmail.com",
    to: "gurucharan@hminnovance.com",
    subject:"Reset Password OTP",
    text: `
    hell reset password OTP for email  is ${otpnum}
    
    
    If you have any questions, please don't hesitate to contact me.
    
    Your faithfully, `
  };
//   console.log(mailOptions)

  transporter.sendMail(mailOptions, function(error,info){
    if (error) {
      console.log(error);
    } else {
     res.status(200).send(info)
    }
  });
}

/*------------------------------Task for 6 feb--------------------------------*/



/*----------------------------------------adminverfiypassword api------------------------------------------*/

const adminverfiypassword = async (req, res) => {
try{

    let otp = req.body.otp
    let email = req.body.email
    if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "please enter a data in request body" })

    let isAdmin = await adminModel.findOne({email:email})
    if(!isAdmin) return res.status(404).send({status:false, message:"Account not found for this email"})
if(otp !== isAdmin.otp){
    return res.status(403).send({status:false, message:"Invalid otp"})
}else{
    return res.send({status:true, message:"OTP verified successfully"})
}
}
  catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
}

/*----------------------------------------adminchangepassword api------------------------------------------*/
const adminchangepassword = async (req, res) => {
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
    let changepassword=await adminModel.findOneAndUpdate({email:email},
        {$set:{password:bcryptPassword,Timewhenyouupadted: new Date()}}
        )
       res.status(200).send({ status: true, data: `succesfully password updated ${changepassword}`});
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
}



const adminIdgenereate = async (req, res) => {
    try{
        let employerid=req.body.employerid
        if (!isNumberstring( employerid)) { return res.status(400).send({ status: false, msg: "Enter valid employer Id it may consists number or string." }) }
        
        const uniqueemplyerId = await employerIdModel.findOne({employeeId: employerid })
        if ( uniqueemplyerId) {
            return res.status(400).send({ status: false, msg: "This emplpyer Id is already Present " })
        }
        const savedEmplyerId = await employerIdModel.create({employeeId:employerid})
        res.status(200).send({ status: true,savedEmplyerId})


    }
 catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
}


////////////////////////EmployerIdSchema/////////////////////////////////////////////


const adminlogout = async (req, res) => {
    try{
            res.clearCookie("Access_token")
            res.json({ success: true, message: 'Sign out successfully!' });
    }
 catch (err) { return res.status(500).send({ status: false, msg: err.massage }) }
}


module.exports = { adminRegister, adminLogin, adminreset,admiemailsend,adminverfiypassword,adminchangepassword,adminIdgenereate,adminlogout};

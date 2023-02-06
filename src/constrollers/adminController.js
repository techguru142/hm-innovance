const admin = require('../models/adminSchema');

const adminRegister = async(req,res)=>{
    const adminInfo = req.body
    const{name, email, mobile, password} = adminInfo
    const savedAdminInfo = await admin.create(adminInfo)
    res.status(200).send({status:true, savedAdminInfo})
};

const adminLogin = async(req,res)=>{
const isRegisterAdmin = await admin.findOne({email:req.body.email})
res.status(200).send({status:true, Message:"logged in successfully"})

}

module.exports = {adminRegister,adminLogin}
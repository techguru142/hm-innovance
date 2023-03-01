const Leads = require('../models/leadsModel');
const Users = require('../models/userModel')
const {isValid, isValidRequest,isValidName ,isValidPhone,isValidEmail,isValidPwd} = require('../utills/validation')

  // Allocate leads to employee
const allocateLeads = async (req, res) => {
    try {
      const clientLeads = req.body.task;
      if(!isValidRequest(req.body)){
        return res.status(422).send({status:false, message:"Invalid! request"})
      }
      if (clientLeads.length === 0)
        return res.status(400).send({ status: false, message: "Leads are empty" });
  
      const validClientLeads = clientLeads.filter(
        (ele) => ele.name && ele.email && ele.contact && ele.message
      );
      if (validClientLeads.length !== clientLeads.length)
        return res
          .status(400)
          .send({ status: false, message: "Client info is missing" });
  
      const arr = validClientLeads.map((ele) => ({
        name: ele.name,
        email: ele.email.toLowerCase(),
        contact: ele.contact,
        message: ele.message
      }));
  
      const employees = await Users.find();
      const numberOfEmployees = employees.length;
      const numberOfLeads = arr.length;
      const leadsPerEmployee = Math.floor(numberOfLeads / numberOfEmployees);
      const remainingLeads = numberOfLeads % numberOfEmployees;
      let leadsAssigned = 0;
      for (let i = 0; i < numberOfEmployees; i++) {
        const employee = employees[i];
        const employeeLeads = await Leads.find({ employeeId: employee.employeeId });
        const numberOfEmployeeLeads = employeeLeads.length;
        let leadsToAssign = leadsPerEmployee - numberOfEmployeeLeads;
        if (i < remainingLeads) leadsToAssign++;
  
        for (let j = 0; j < leadsToAssign; j++) {
          await Leads.create({
            employeeId: employee.employeeId,
            userName: employee.userName,
            assignTo: employee.name,
            tasks: [arr[leadsAssigned]],
          });
          leadsAssigned++;
        }
      }
  
      const leadsData = await Leads.find().sort({ createdAt: 1 });
      return res.status(200).send({ status: true, leads:leadsData });
    } catch (error) {
      return res.status(500).send({ status: false, Error: error.message });
    }
  };


const reAllocateLeads = async (req, res) => {
    try {
        const employeeId = req.params.employeeId
        const { name, email, contact } = req.body;
        if(!employeeId){
            return res.status(400).send({status:false, message:"Invalid params"})
        }else if(isNaN){
            return res.status(422).send({status:false, message:"Invalid employee id"})
        }else if(!name || !email || !contact){
            return res.status(400).send({status:false, message:"Required fileds are missing"})
        }else if(!isValid(name) || !isValidName(name)){
            return res.status(422).send({status:false, message:"Invalid!  name"})
        }else if(!isValidEmail(email)){
            return res.status(422).send({status:false, message:"clients Email is invalid!"})
        }else if(!isValidPhone(contact)){
            return res.status(422).send({status:false, message:"Invalid! phone number"})
        }
        const employeeData = await Users.findOne({employeeId:employeeId});
        if(!employeeData) return res.status(404).send({status:false, message:"Employee not found for this id"})
        let newLeads = {
            employeeId:employeeId,
            assignTo:employeeData.name,
            tasks:[{
                "name":name, "email":email.toLowerCase(), "contact":contact
            }]
        }
        await Leads.create(newLeads);
        return res.status(201).send({status:true, message:"Leads added successfully!"})
    } catch (error) {
        return res.status(500).send({status:false, Error:error.message})
    }
};

// reassign leads to an employee
const reAssignLeads = async(req,res)=>{
const {assignTo, name, email, contact,message, employeeId, userName} = req.body
if(!assignTo || !name || !email || !contact || !message || !userName){
    return res.status(400).send({status:false, message:"leads information is missing!"})
}
if(!isValid(assignTo) || isValidName(assignTo)){
return res.status(422).send({status:false, message:"Invalid! Employee Name"})
}else if(!isValid(name) || !isValidName(name)){
    return res.status(422).send({status:false, message:"Invalid! Client name"})
}else if(!isValidEmail(email)){
    return res.status(422).send({status:false, message:"Invalid! email"})
}else if(!isValidPhone(contact)){
    return res.status(422).send({status:false, message:"Invalid phone number"})
}else if(isNaN(employeeId)){
    return res.status(422).send({status:false, message:"Employee id should be number only"})
}else if(typeof userName !== "String"){
    return res.status(422).send({status:false, message:"Invalid userName"})
}
let empInfo = await Users.findOne({userName:userName});
if(!empInfo){
    return res.status(422).send({status:false, message:"Invalid! userName"})
}
await Leads.create({
    employeeId:empInfo.employeeId,
    userName: empInfo.userName,
    assignTo: empInfo.name,
    tasks:[{
        "name": name,
        "email":email,
        "contact": contact,
        "message": message
    }]
});
 await Leads.findOneAndUpdate({employeeId:employeeId, "tasks.email":email}, {isDeleted:true})

res.status(200).send({status: true, message:"Thank you! for leads reassigning"})
}
// get all leads
const getAllLeads = async(req,res)=>{
    let data = await Leads.find({isDeleted:false})
    let modifiedLeads = []
    data.map((ele)=>{
        let newObj={
            employeeId:ele.employeeId,
            assignTo:ele.assignTo,
            name:ele.tasks[0].name,
            email:ele.tasks[0].email,
            contact:ele.tasks[0].contact,
            message:ele.tasks[0].message
        }
        modifiedLeads.push(newObj)
    })
    res.status(200).send({status:true, leads:modifiedLeads})
}

// get lattest leads
const getLeads = async(req,res)=>{
    var leadsData = await Leads.find({isDeleted:false}).sort({updatedAt:-1})
    var arr = leadsData
    let result = []
    var map = new Map()
    for(let i =0; i< arr.length; i++){
    if(!map.has(arr[i].tasks[0].email)){
        map.set(arr[i].tasks[0].email, arr[i])
        result.push(arr[i])
    
    }else{
        continue;
    }
}
    res.status(200).send({status:true, leads:result})
}
//  get leads by status
const getLeadsByStatus = async(req,res)=>{
    let status = req.params.status
    if(!status) return res.status(400).send({status:false, message:"Status is required"})
    if(!["Allocated", "Pending", "Not Intrested", "Completed"].includes(status) || !isValid(status)){
        return res.status(422).send({status:false, message:"Invalid! Status"})
    }
    const leadsStatus = await Leads.find({status:status, isDeleted:false}).select({createdAt:0, updatedAt:0, __v:0, _id:0});
    if(leadsStatus.length === 0){
      return  res.status(200).send('Leads not found!')
    }
    return res.status(200).send({status:true, leads:leadsStatus});
};
//get single leads by client email
// const getSingleLeads = async(req, res)=>{
//     const clientEmail = req.body.email
//     const leads = await Leads.find({["tasks.email"]:clientEmail, isDeleted:false}).select({employeeId:1, assignTo:1, status:1,tasks:1, _id:0})
//     res.status(200).send({status:true, leads:leads})
// };

// const getLeadsByEmployeeId = async(req,res)=>{
//     const empId = req.body.id
//     const empLeads = await Leads.find({employeeId:empId})
//     res.status(200).send({status:true, empLeads})
// }

const updateLeadsStatus = async(req,res)=>{
    const {employeeId, email, status} = req.body
    if(!employeeId && employeeId !==0) return res.status(400).send({status:false, message:"Employee id is required"})
    if(isNaN(employeeId)) return res.status(400).send({status:false, message:"Id should be number only"})
    if(!email || !status){
        return res.status(422).send({status:false, message:"Email and status are required to update"})
    }
    if(!isValidEmail(email)){
        return res.status(422).send({status:false, message:"Invalid! email"})
    }
    if(!["Pending", "Not Intrested", "Completed"].includes(status) || !isValid(status)){
        return res.status(422).send({status:false, message:"Invalid! Status"})
    }
    
    const updatedStatus = await Leads.findOneAndUpdate({employeeId:employeeId, 'tasks.email':email}, {$set:{status:status}})
    if(!updateStatus){
        return res.status(404).send({status:false, message:"Leads not found"})
    }
    res.status(200).send({status:true, message:"Status updated successfully",updatedStatus});
};
// Delete leads by admin
const deleteLeads = async(req,res)=>{
    const {employeeId, email} = req.body
    if(!employeeId || !email){
        return res.status(422).send({status:false, message:"employee id and email are required!"})
    }else if(isNaN(employeeId)){
        return res.status(422).send({status:false, message:"Invalid! employee id"})
    }else if(!isValidEmail(email)){
        return res.status(422).send({status:false, message:"Invalid email"})
    }
   let deletedLeads =  await Leads.findByOneAndUpdate({employeeId:employeeId,"tasks.email":email}, {isDeleted:true})
   if(!deletedLeads){
    return res.status(404).send({status:false, message:"Leads not found"})
   }
    res.status(200).send({status:true, message:"Leads deleted successfully!"})
};



module.exports = { allocateLeads, reAllocateLeads,reAssignLeads,getAllLeads,getLeads, getLeadsByStatus,updateLeadsStatus,deleteLeads}



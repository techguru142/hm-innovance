const Leads = require('../models/leadsModel');
const Users = require('../models/userModel')


const allocateLeads = async (req, res) => {
    try {
        let clientLeads = req.body.task
    if(clientLeads.length ===0) return res.status(400).send({status:false, message:"Leads are empty"})
    clientLeads.map((ele) => {
        if(!ele.name || !ele.email || !ele.contact){
            return res.status(400).send({status:false, message:"Client info is missing"})
        }});

    let arr = []
    clientLeads.map((ele) => {
        let obj = {
            name: ele.name,
            email: ele.email.toLowerCase(),
            contact:ele.contact,
            message: ele.message
        }
        arr.push(obj)

     });

    let employies = await Users.find()
    let numberOfEmp = employies.length;
    let numberOfTask = arr.length;
    let splitedLeads 
    if(numberOfEmp < numberOfTask){
        splitedLeads = Math.floor(numberOfTask / numberOfEmp)
    }else{
        splitedLeads = Math.floor(numberOfEmp / numberOfTask)
    }
    let calculatedLeads = splitedLeads*numberOfEmp
    let restLeads = numberOfTask - calculatedLeads
    let condition = Math.max(numberOfEmp,numberOfTask)
    var currEmpId = 0;
   for(let i =0; i < condition; i++){
    
    let verifyEmpId = employies.map((ele)=>{
        if(ele.employeeId == currEmpId) return true
    })
    if(verifyEmpId.includes(true)){
        if(numberOfTask < numberOfEmp){
           await Leads.create({
            employeeId:currEmpId,
                assignTo:arr[currEmpId].name,
                tasks:[arr[i]]
            })
            currEmpId++;
        }else if(calculatedLeads < numberOfTask){
            await Leads.create({
                employeeId:currEmpId,
                assignTo:arr[currEmpId].name,
                tasks:[arr[i]]
            })
           if(i == splitedLeads){
            currEmpId++
           }
        }else{
              await Leads.create({
                employeeId:currEmpId,
                assignTo:arr[currEmpId].name,
                tasks:[arr[i]]
            })
            if(i == splitedLeads){
            currEmpId++
           }
        }
    }
   };
   if(restLeads){
    for(let i =arr.length - 1; i >= restLeads; i--){
        let vid = 0
        await Leads.create({
            employeeId:vid,
            assignTo:arr[i].name,
            tasks:[arr[i]]
        })
        vid++
    }
   }
   let leadsData = await Leads.find().sort({createdAt:1});
    return res.status(200).send({ status: true, leadsData })
    } catch (error) {
        return res.status(500).send({status:false, Error:error.message})
    }
}

const reAllocateLeads = async (req, res) => {
    try {
        const taskData = req.body;
        const employeeId = req.params.id
        //let employeeName = req.body.employeeName
        const { name, email, contact } = taskData;
        const employeeData = await Users.findOne({id:employeeId});
        if(!employeeData) return res.status(400).send({status:false, message:"Incorrect Employee id"})
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
    res.status(200).send({status:true, result})
}
const leadsStatus = async(req,res)=>{
    let status = req.params.status
    if(!status) return res.status(400).send({status:false, message:"Status is required"})
    const leadsStatus = await Leads.find({status:status, isDeleted:false}).select({createdAt:0, updatedAt:0, __v:0, _id:0});
    if(!leadsStatus){
      return  res.status(200).send('Leads not found!')
    }
    return res.status(200).send({status:true, leadsStatus});
};
   
const getSingleLeads = async(req, res)=>{
    const clientEmail = req.body.email
    const leads = await Leads.find({["tasks.email"]:clientEmail}).select({employeeId:1, assignTo:1, status:1,tasks:1, _id:0})
    res.status(200).send(leads)
};

const getLeadsByEmployeeId = async(req,res)=>{
    const empId = req.body.id
    const empLeads = await Leads.find({employeeId:empId})
    res.status(200).send({status:true, empLeads})
}

const updateStatus = async(req,res)=>{
    const employeeId = req.body.id
    if(!employeeId) return res.status(400).send({status:false, message:"Employee id is required"})
    if(isNaN(employeeId)) return res.status(400).send({status:false, message:"Id should be number only"})
    const updatedStatus = await Leads.findOneAndUpdate({employeeId:employeeId, [tasks[0].email]:req.body.email}, {status:req.body.status},{new:true})
    res.status(200).send({status:true, message:"Status updated successfully"});
};

const deleteLeads = async(req,res)=>{
    let employeeId = req.body.id
    let email = req.body.email
    await Leads.findByIdAndUpdate({employeeId:employeeId,"tasks.email":email}, {isDeleted:true})
    res.status(200).send({status:true, message:"Leads deleted successfully!"})
};



module.exports = { allocateLeads, reAllocateLeads,getLeads,getSingleLeads,getLeadsByEmployeeId, leadsStatus,updateStatus,deleteLeads}
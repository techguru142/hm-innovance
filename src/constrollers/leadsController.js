const Leads = require('../models/leadsModel');
const Users = require('../models/userModel');

const allocateLeads = async (req, res) => {
    let clientLeads = req.body.task
    let arr = []
    clientLeads.map((ele) => {
        let obj = {
            name: ele.name,
            email: ele.name,
            message: ele.message
        }
        arr.push(obj)

    });
    let employies = await Users.find()
    let numberOfEmp = employies.length;
    let numberOfTask = arr.length;
    let splitedTask = Math.floor(numberOfTask / numberOfEmp)
    var id = 0;
    var employee = await Users.findOne({ id: id })
    // var taskValue = []
    for (let i = 0; i < arr.length; i++) {
        if (employee) {
            if (numberOfTask <= numberOfEmp) {
                await Leads.create({
                    employeeId: id,
                    assignTo: employee.name,
                    tasks: [arr[i]]
                })
                id++
            } else {

                await Leads.create({
                    employeeId: id,
                    assignTo: employee.name,
                    tasks: [arr[i]]
                })
                if (i == splitedTask) {

                    id++
                }
            }
        } else {
            id++
        }
    }

    let leadsData = await Leads.find().select({ employeeId: 1, assignTo: 1, tasks: 1, status: 1, _id: 0 })
    res.status(200).send({ status: true, leadsData })
}

const reAllocateTask = async (req, res) => {
    const taskData = req.body
    const { name, email, contact, employeeName } = taskData;
    var isEmployee = await Users.findOne({ name: employeeName })
    if (!isEmployee) {
        return res.status(404).send({ status: false, message: "employee doesn't exists" })
    } else {
        setTimeout(() => {

        }, 600000)
    }
}


module.exports = { allocateLeads, reAllocateTask }
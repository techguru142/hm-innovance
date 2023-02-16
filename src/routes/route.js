const express = require('express')
const router = express.Router()

const {allocateLeads , reAllocateLeads,getLeads,getLeadsByEmployeeId,getSingleLeads,leadsStatus, updateStatus} = require('../constrollers/leadsController');
const { adminRegister, adminLogin, adminreset,admiemailsend,adminverfiypassword,adminchangepassword,adminIdgenereate,adminlogout} = require('../constrollers/adminController');
const { userRegister, userLogin, logoutUser, getAllUser,Userverfiypassword,Userchangepassword,Usergenereate,userEmailsend} = require('../constrollers/userController');


// Employee router
router.post('/userRegister', userRegister);
router.post('/userLogin', userLogin);
router.get('/userLogout', logoutUser);
router.get('/getUser', getAllUser);

//Admin Routes
router.post('/registerAdmin', adminRegister);
router.post('/loginAdmin', adminLogin);
router.post('/resetpwd', adminreset)
// Leads Router
router.post('/leads', allocateLeads);
router.post('/reAllocate/:id', reAllocateLeads);
router.get('/getLeads', getLeads);
router.get('/getLeadsById',getLeadsByEmployeeId)
router.get('/getSingleLeads', getSingleLeads)
router.get('/:status', leadsStatus);
router.put('/updateStatus/', updateStatus)


module.exports = router;
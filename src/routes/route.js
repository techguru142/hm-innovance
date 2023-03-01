const express = require('express')
const router = express.Router()

const {allocateLeads , reAllocateLeads, reAssignLeads,getAllLeads,getLeads,getLeadsByStatus, updateLeadsStatus} = require('../controllers/leadsController');
const { adminRegister, adminLogin, adminreset,admiemailsend,adminverfiypassword,adminchangepassword,adminIdgenereate,adminlogout} = require('../controllers/adminController');
const { userRegister, userLogin, logoutUser, getAllUser,Userverfiypassword,Userchangepassword,Usergenereate,userEmailsend} = require('../controllers/userController');


// Employee router
router.post('/userRegister', userRegister);
router.post('/userLogin', userLogin);
router.get('/userLogout', logoutUser);
router.get('/getUser', getAllUser);
router.post('/userEmailSend', userEmailsend)

//Admin Routes
router.post('/registerAdmin', adminRegister);
router.post('/loginAdmin', adminLogin);
router.post('/resetpwd', adminreset);
router.post('/sendOtp',admiemailsend )
// Leads Router
router.post('/leads', allocateLeads);
router.post('/reAllocate/:employeeId', reAllocateLeads);
router.post('/reAssignLeads', reAssignLeads );
router.get('/getAllLeads', getAllLeads)
router.get('/getLeads', getLeads);
router.get('/leads/:status', getLeadsByStatus);
router.put('/updateStatus/', updateLeadsStatus)


module.exports = router;
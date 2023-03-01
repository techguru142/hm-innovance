const express = require('express')
const router = express.Router()

const {allocateLeads , reAllocateLeads, reAssignLeads,getAllLeads,getLeads,getLeadsByStatus, updateLeadsStatus} = require('../controllers/leadsController');
const { adminRegister, adminLogin, adminreset,admiemailsend,adminverfiypassword,adminchangepassword,adminIdgenereate,adminlogout} = require('../controllers/adminController');
const { userRegister, userLogin, logoutUser, getAllUser,Userverfiypassword,Userchangepassword,Usergenereate,userEmailsend} = require('../controllers/userController');
const{authentication,authorisation} = require('../middleware/auth')


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
router.post('/leads',authentication, authorisation, allocateLeads);
router.post('/reAllocate/:employeeId',authentication, authorisation, reAllocateLeads);
router.post('/reAssignLeads',authentication, authorisation, reAssignLeads );
router.get('/getAllLeads',authentication, authorisation, getAllLeads)
router.get('/getLeads',authentication, authorisation, getLeads);
router.get('/leads/:status',authentication, authorisation, getLeadsByStatus);
router.put('/updateStatus/',authentication, authorisation, updateLeadsStatus)


module.exports = router;
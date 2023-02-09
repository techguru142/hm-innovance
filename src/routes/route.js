const express = require('express')
const router = express.Router()
const {userRegister, userLogin,logoutUser, getAllUser,} = require('../constrollers/userController');
const {allocateLeads , reAllocateLeads,getLeads,getLeadsByEmployeeId,getSingleLeads,leadsStatus, updateStatus} = require('../constrollers/leadsController');

// Employee router
router.post('/userRegister', userRegister);
router.post('/userLogin', userLogin);
router.get('/userLogout', logoutUser);
router.get('/getUser', getAllUser)
// Leads Router
router.post('/task', allocateLeads);
router.post('/reAllocate/:id', reAllocateLeads);
router.get('/getLeads', getLeads);
router.get('/getLeadsById',getLeadsByEmployeeId)
router.get('/getSingleLeads', getSingleLeads)
router.get('/:status', leadsStatus);
router.put('/updateStatus/:id', updateStatus)


module.exports = router;
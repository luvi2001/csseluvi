const express = require('express');
const router = express.Router();
const { getAllResidents,getResident, requestNewBin,getUserBins , reportWasteIssue, makePayment , getPendingPaymentsForUser,createGarbageCollectionRequest,getResidentDetails,} = require('../controllers/residentController');
const { getNotifications } = require('../controllers/notificationsController');
const authMiddleware=require('../middleware/authMiddleware')

// Get resident details by user ID
router.get('/getResident/:id', getResident);

router.get('/getAllResidents', getAllResidents);

// Request a new bin as a resident
router.post('/requestBin/:id', requestNewBin);

router.post('/getUserBins/:id',getUserBins);

// Report a waste issue as a resident
router.post('/reportIssue/:id', reportWasteIssue);

// Make a payment as a resident
router.post('/makePayment', makePayment);

// Get notifications of the user
router.get('/:id/notifications', getNotifications);

// Get pending payments
router.get('/:id/payments/pending',getPendingPaymentsForUser);

router.post('/create-request', createGarbageCollectionRequest);
router.get('/details', authMiddleware, getResidentDetails);

module.exports = router;

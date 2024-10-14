const express = require('express');
const router = express.Router();
const { getBinRequests,getUserProfile,getGarbageRequests,updateGarbageRequest,getWasteCollectors } = require('../controllers/adminControllerluvi');
const authenticateUser = require("../middleware/authMiddleware");

// Route to get all bin requests with resident details
router.get('/bin-requests', getBinRequests);
router.get('/residents/me', authenticateUser, getUserProfile);
router.get('/garbage-requests', getGarbageRequests);

// Update garbage request status and assign waste collector
router.put('/garbage-requests/:id', updateGarbageRequest);

// Fetch all waste collectors
router.get('/waste-collectors', getWasteCollectors);

module.exports = router;

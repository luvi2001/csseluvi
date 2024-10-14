const express = require('express');
const router = express.Router();
const { getServiceManager, assignRoute } = require('../controllers/serviceManagerController');

// Get service manager details by user ID
router.get('/getServiceManager/:id', getServiceManager);

// Assign a new route to a service manager
router.post('/assignRoute/:id', assignRoute);

module.exports = router;

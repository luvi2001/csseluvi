const express = require('express');
const router = express.Router();
const { getWasteCollector, updateRouteDetails, scanBin } = require('../controllers/wasteCollectorController');

// Get waste collector details by user ID
router.get('/getWasteCollector/:id', getWasteCollector);

// Update route details for a waste collector
router.put('/updateRouteDetails/:id', updateRouteDetails);

// Scan a bin after collection as a waste collector
router.post('/scanBin/:id', scanBin);

module.exports = router;

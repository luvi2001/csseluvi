const express = require('express');
const router = express.Router();
const { getBin, createBin, updateBinStatus } = require('../controllers/binController');

// Get details of a bin by its ID
router.get('/getBin/:id', getBin);

// Create a new bin
router.post('/createBin', createBin);

// Update the status of a bin (e.g., Active, Full, Damaged)
router.put('/updateBinStatus/:id', updateBinStatus);

module.exports = router;

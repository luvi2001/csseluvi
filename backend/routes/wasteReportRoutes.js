const express = require('express');
const router = express.Router();
const { getWasteReport, createWasteReport } = require('../controllers/wasteReportController');

// Get details of a waste report by its ID
router.get('/getWasteReport/:id', getWasteReport);

// Create a new waste report
router.post('/createWasteReport', createWasteReport);

module.exports = router;

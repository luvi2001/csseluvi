const express = require('express');
const router = express.Router();
const { getPayment, createPayment } = require('../controllers/paymentController');

// Get payment details by payment ID
router.get('/getPayment/:id', getPayment);


// Create a new payment for a resident
router.post('/createPayment', createPayment);

module.exports = router;

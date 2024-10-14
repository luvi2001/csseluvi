const Payment = require('../models/paymentSchema');

// Get a single payment by ID
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new payment
const createPayment = async (req, res) => {
  const { residentId, amount } = req.body;
  const payment = new Payment({ residentId, amount });

  try {
    const newPayment = await payment.save();

    // Assuming createNotification is available to notify residents about the payment
    await createNotification(residentId, `Your payment of $${amount} has been successfully made.`);

    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all payments for a specific resident
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ residentId: req.params.id }); // Find all payments by residentId
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending payments for a specific resident
const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ residentId: req.params.id, status: 'Pending' }); // Find pending payments
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getPayment,
  createPayment,
  getAllPayments,
  getPendingPayments,
};

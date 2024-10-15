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
const makePayment = async (req, res) => {
  console.log("Payment route hit");
  console.log(`Request Body: ${JSON.stringify(req.body)}`);

  const { residentId, amount, cardNumber, expirationDate, cvc, billingAddress, saveCardDetails, binType } = req.body;

  console.log(`In PaymentController: makePayment: ${residentId}, ${amount}, ${cardNumber}, ${expirationDate}, ${cvc}, ${billingAddress}, ${saveCardDetails}, ${binType}`);

  try {
    // Save the payment to the Payment collection
    const payment = new Payment({ residentId, amount });
    const newPayment = await payment.save();

    // If the user wants to save their card details, update the Resident schema
    if (saveCardDetails) {
      await Resident.findOneAndUpdate(
        { _id: residentId },
        {
          $set: {
            "paymentDetails": {
              cardNumber,
              expiryDate: expirationDate,
              cvc,
              billingAddress
            }
          }
        },
        { new: true, upsert: true } // Ensure the `paymentDetails` is updated or created
      );
    }

    // After successful payment, create a new bin request with default status "Pending"
    const binRequest = new BinRequest({
      residentId, // Link the bin request to the resident
      binType, // Store the bin type passed in the request
      status: 'Pending' // Default status as "Pending"
    });

    const newBinRequest = await binRequest.save();

    // Send a notification to the resident about the payment and the bin request
    await createNotification(residentId, `Your payment of $${amount} has been successfully made and your request for a ${binType} bin is pending.`);

    // Send the response after everything is successful
    //return res.status(201).json({ payment: newPayment, binRequest: newBinRequest });
    return res.status(201).json({ message: 'Payment and bin request processed successfully.' });

  } catch (error) {
    console.error("Error in makePayment:", error);
    return res.status(400).json({ message: error.message });
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
  makePayment,
  getAllPayments,
  getPendingPayments,
};

const Resident = require('../models/residentSchema');
const BinRequest = require('../models/BinRequestSchema');
const WasteReport = require('../models/wasteReportSchema');
const Payment = require('../models/paymentSchema');
const Bin = require('../models/binSchema');
const { createNotification } = require('./notificationsController');
const GarbageCollectionRequest=require('../models/garbageCollectionRequestSchema')

const getResident = async (req, res) => {
  try {
    const resident = await Resident.findOne({ userId: req.params.id });
    res.json(resident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllResidents = async (req, res) => {
  try {
    // Retrieve all residents from the Resident collection
    const residents = await Resident.find();
    
    // If no residents found, return a message
    if (residents.length === 0) {
      return res.status(404).json({ message: 'No residents found.' });
    }

    // Return the list of residents
    res.json(residents);
  } catch (error) {
    // Handle any errors during the database query
    res.status(500).json({ message: error.message });
  }
};

const requestNewBin = async (req, res) => {
  const { binType } = req.body;
  const binRequest = new BinRequest({ residentId: req.params.id, binType });

  try {
    const newRequest = await binRequest.save();
    
    await createNotification(req.params.id, `Your request for a ${binType} bin has been submitted.`);
    
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserBins = async (req, res) => {
  try {
    // Find the bins associated with the residentId passed in the URL params
    const bins = await Bin.find({ residentId: req.params.id });
    res.json(bins); // Send the bins data back as JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reportWasteIssue = async (req, res) => {
  const { description } = req.body;
  const wasteReport = new WasteReport({ residentId: req.params.id, description });

  try {
    const newReport = await wasteReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const makePayment = async (req, res) => {
  const { amount, cardNumber, expiryDate, cvc, billingAddress, saveCardDetails, binType } = req.body;
  const payment = new Payment({ residentId: req.params.id, amount });

  try {
    // Save the payment to the Payment collection
    const newPayment = await payment.save();

    // If the user wants to save their card details, update the Resident schema
    if (saveCardDetails) {
      await Resident.findOneAndUpdate(
        { userId: req.params.id }, // Find the resident by userId
        {
          $set: {
            "paymentDetails.cardNumber": cardNumber,
            "paymentDetails.expiryDate": expiryDate,
            "paymentDetails.cvc": cvc,
            "paymentDetails.billingAddress": billingAddress,
          }
        },
        { new: true }
      );
    }

    // After successful payment, create a new bin request with default status "Pending"
    const binRequest = new BinRequest({
      residentId: req.params.id, // Link the bin request to the resident
      binType, // Store the bin type passed in the request
      status: 'Pending' // Default status as "Pending"
    });

    const newBinRequest = await binRequest.save(); // Save the bin request to the database

    // Send a notification to the resident about the payment and the bin request
    await createNotification(req.params.id, `Your payment of $${amount} has been successfully made and your request for a ${binType} bin is pending.`);

    res.status(201).json({ payment: newPayment, binRequest: newBinRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get pending payments for a specific resident (user)
const getPendingPaymentsForUser = async (req, res) => {
  try {
    // Find all payments for the resident with the status 'Pending'
    const payments = await Payment.find({ residentId: req.params.id, status: 'Pending' });

    // If no pending payments found, return a message
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No pending payments found for this user.' });
    }

    // Return the list of pending payments
    res.json(payments);
  } catch (error) {
    // Handle any errors during the database query
    res.status(500).json({ message: error.message });
  }
};




const createGarbageCollectionRequest = async (req, res) => {
  try {
    const { residentId, residentName, residentAddress } = req.body;


    const newRequest = new GarbageCollectionRequest({
      residentId,
      residentName,
      residentAddress,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getResidentDetails = async (req, res) => {
  try {
    // Fetch resident details using the userId (from token)
    const resident = await Resident.findOne({ userId: req.user.id })
      .populate('userId', 'name email')  // Populate User fields (name, email)
      .exec();

    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Return resident details including name, email, and address
    res.status(200).json({
      residentId: resident.userId._id,
      residentName: resident.userId.name,
      residentEmail: resident.userId.email,
      address: resident.address,
    });
  } catch (error) {
    console.error('Error fetching resident details:', error);
    res.status(500).json({ message: 'Failed to fetch resident details' });
  }
};

module.exports = {
  getUserBins,
  getResident,
  requestNewBin,
  reportWasteIssue,
  makePayment,
  getPendingPaymentsForUser,
  getAllResidents,
  createGarbageCollectionRequest,
  getResidentDetails
};

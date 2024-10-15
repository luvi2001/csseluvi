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
    console.log(`Inside getUserBins in residentController`);

    // Find the bins associated with the residentId passed in the URL params
    const bins = await Bin.find({ residentId: req.params.id });

    // Check if no bins are found (empty array)
    if (bins.length === 0) {
      return res.status(404).json({ message: "No bins available" });
    }

    // Return the bins if found
    res.status(200).json(bins); // Send the bins data back as JSON

  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle any errors during the database query
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
  console.log("Payment route hit"); // Add this log at the top
  console.log(`Request Body: ${JSON.stringify(req.body)}`);

  const { residentId, amount, cardNumber, expirationDate, cvc, billingAddress, saveCardDetails, binType } = req.body;

  console.log(`In PaymentController: makePayment: ${residentId}, ${amount}, ${cardNumber}, ${expirationDate}, ${cvc}, ${billingAddress}, ${saveCardDetails}, ${binType}`);

  try {
    // Save the payment to the Payment collection
    const payment = new Payment({ residentId, amount });
    const newPayment = await payment.save();

    // If the user wants to save their card details, update the Resident schema
    if (saveCardDetails) {
      // Check if the paymentDetails exists, if not, initialize it with an empty object
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
        { new: true, upsert: true } // `upsert: true` will create the field if it doesn't exist
      );
    }

    // After successful payment, create a new bin request with default status "Pending"
    const binRequest = new BinRequest({
      residentId, // Link the bin request to the resident
      binType, // Store the bin type passed in the request
      status: 'Pending' // Default status as "Pending"
    });

    const newBinRequest = await binRequest.save(); // Save the bin request to the database

    // Send a notification to the resident about the payment and the bin request
    await createNotification(residentId, `Your payment of $${amount} has been successfully made and your request for a ${binType} bin is pending.`);

    res.status(201).json({ payment: newPayment, binRequest: newBinRequest });

    navigation.navigate
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
    console.log(`In residentController:getResidentDetails(Luvi):${req.userId}`);
    
    // Fetch resident details using the userId (from token)
    const resident = await Resident.findOne({ userId: req.userId })
      .populate('userId', 'name email')  // Populate the user fields (name, email)
      .exec();

    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Return resident details including name, email, and address
    res.status(200).json({
      residentId: resident._id,
      residentName: resident.userId.name, // Access user's name
      residentEmail: resident.userId.email, // Access user's email
      address: resident.address, // Resident-specific data
    });
  } catch (error) {
    console.error('Error fetching resident details:', error);
    res.status(500).json({ message: 'Failed to fetch resident details' });
  }
};

const getResidentDetailsWithUserId = async (req, res) => {
  console.log(`Inside resident controller: get res with uid`);
  try {
    // Get the userId from the request parameters
    const  userId  = req.params.id;
    console.log(`Inside get res with uid:${userId}`);
    
    // Fetch resident details using the userId passed in the request
    const resident = await Resident.findOne({ userId })
      .populate('userId', 'name email')  // Populate the user fields (name, email)
      .exec();

    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    console.log(`residentId: ${resident._id},
        address: ${resident.address},residentName: ${resident.userId.name},residentEmail: ${resident.userId.email} `);
    // residentName: resident.userId.name, 
      // residentEmail: resident.userId.email, 
    // Return resident details including name, email, and address
    res.status(200).json({
      residentId: resident._id,
      residentName: resident.userId.name,
      residentEmail: resident.userId.email,
      address: resident.address, // Resident-specific data
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
  getResidentDetails,
  getResidentDetailsWithUserId
};

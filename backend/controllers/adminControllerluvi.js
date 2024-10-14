const BinRequest = require('../models/BinRequestSchema');
const Resident = require('../models/residentSchema');
const jwt = require('jsonwebtoken');
const GarbageCollectionRequest = require('../models/garbageCollectionRequestSchema');
const User = require('../models/userSchema');

// Controller to fetch bin requests with resident details
const getBinRequests = async (req, res) => {
  try {
    // Fetch bin requests and populate resident and user details
    const binRequests = await BinRequest.find()
      .populate({
        path: 'residentId',
        select: 'userId address',
        populate: {
          path: 'userId',
          select: 'name', // Assuming User model has a 'name' field
        },
      });

    // Check if binRequests is not empty
    if (!binRequests || binRequests.length === 0) {
      return res.status(404).json({ error: 'No bin requests found' });
    }

    // Validate each request to ensure residentId and userId exist
    const validBinRequests = binRequests.filter(
      (request) => request.residentId && request.residentId.userId
    );

    if (validBinRequests.length === 0) {
      return res.status(404).json({ error: 'No valid bin requests found' });
    }

    // Return valid bin requests
    res.status(200).json(validBinRequests);
  } catch (error) {
    console.error('Error fetching bin requests:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
    try {
      // After authentication, req.user will contain the user's information
      const userName = req.user.name;
  
      res.json({
        message: 'User profile data',
        userName: userName, // You can access the logged-in user's name here
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  };
  

  const getGarbageRequests = async (req, res) => {
    try {
      const requests = await GarbageCollectionRequest.find().populate('wasteCollector');
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching requests' });
    }
  };
  
  // Update garbage request status and assign waste collector
  const updateGarbageRequest = async (req, res) => {
    const { status, wasteCollector } = req.body;
    try {
      const updatedRequest = await GarbageCollectionRequest.findByIdAndUpdate(
        req.params.id,
        {
          status: status,
          wasteCollector: wasteCollector || null,
        },
        { new: true }
      ).populate('wasteCollector');
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error updating request' });
    }
  };
  
  // Fetch all waste collectors
  const getWasteCollectors = async (req, res) => {
    try {
      const wasteCollectors = await User.find({ userType: 'WasteCollector' });
      res.status(200).json(wasteCollectors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching waste collectors' });
    }
  };

module.exports = {
  getBinRequests,
  getUserProfile,
  getWasteCollectors,
  updateGarbageRequest,
  getGarbageRequests
};

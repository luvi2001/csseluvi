const User = require ('../models/userSchema');
const Resident = require('../models/residentSchema');
const WasteCollector = require('../models/wasteCollectorSchema');
const ServiceManager = require('../models/serviceManagerSchema');


const jwt = require('jsonwebtoken');

//Register User
const registerUser = async (req, res) => {
  console.log('Request received at /register');

  const { name, email, password, address } = req.body;

  // Ensure all required fields are provided
  if (!name || !email || !password || !address) {
    return res.status(400).json({ message: 'All fields are required: name, email, password, and address' });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user with userType set to 'Resident'
    const user = new User({
      name,
      email,
      password,
      userType: 'Resident', // Only residents can register
    });

    // Save the user to the User table
    const newUser = await user.save();

    // Create a new Resident entry
    const resident = new Resident({
      userId: newUser._id,
      address,
    });

    // Save the resident to the Resident table
    await resident.save();

    // Send a success message in the response
    res.status(201).json({
      message: 'You have successfully registered to the system as a resident.',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new user and corresponding type-specific entry
const createUser = async (req, res) => {
  const { name, email, password, userType, address, routeDetails } = req.body; 
  const user = new User({ name, email, password, userType });

  try {
    const newUser = await user.save();

    // Based on the userType, create corresponding user type entry
    if (userType === 'Resident') {
      const resident = new Resident({
        userId: newUser._id,
      });
      await resident.save();
    } else if (userType === 'WasteCollector') {
      const wasteCollector = new WasteCollector({
        userId: newUser._id,
        routeDetails: routeDetails || 'No Route Assigned',
      });
      await wasteCollector.save();
    } else if (userType === 'ServiceManager') {
      const serviceManager = new ServiceManager({
        userId: newUser._id,
      });
      await serviceManager.save();
    } else {
      return res.status(400).json({ message: 'Invalid user type provided' });
    }

    // Send a success message in the response
    res.status(201).json({
      message: `User successfully created as ${userType}`,
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get a single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing user and the associated user type table
const updateUser = async (req, res) => {
  const { name, email, password, userType, address, routeDetails } = req.body;
  
  try {
    // Update the user in the User collection
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Update corresponding user type information
    if (userType === 'Resident') {
      await Resident.findOneAndUpdate({ userId: req.params.id }, { address: address || 'Unknown Address' }, { new: true });
    } else if (userType === 'WasteCollector') {
      await WasteCollector.findOneAndUpdate({ userId: req.params.id }, { routeDetails: routeDetails || 'No Route Assigned' }, { new: true });
    } else if (userType === 'ServiceManager') {
      await ServiceManager.findOneAndUpdate({ userId: req.params.id }, { routeDetails: routeDetails || 'No Route Assigned' }, { new: true });
    } else {
      return res.status(400).json({ message: 'Invalid user type provided' });
    }

    res.json({ message: `${userType} user updated successfully`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user and the associated user type table
const deleteUser = async (req, res) => {
  try {
    // Find the user by ID to determine the userType
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user from User collection
    await User.findByIdAndDelete(req.params.id);

    // Delete from corresponding user type table
    if (user.userType === 'Resident') {
      await Resident.findOneAndDelete({ userId: req.params.id });
    } else if (user.userType === 'WasteCollector') {
      await WasteCollector.findOneAndDelete({ userId: req.params.id });
    } else if (user.userType === 'ServiceManager') {
      await ServiceManager.findOneAndDelete({ userId: req.params.id });
    } else {
      return res.status(400).json({ message: 'Invalid user type provided' });
    }

    res.json({ message: `${user.userType} user and corresponding records deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Direct comparison of plain text password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: '10h',
    });

    // Send response with token and user data
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        name: user.name, // Include the user's name
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};





module.exports = {
  registerUser,
  loginUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};

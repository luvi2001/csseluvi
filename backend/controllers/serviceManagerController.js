const ServiceManager = require('../models/serviceManagerSchema');

const getServiceManager = async (req, res) => {
  try {
    const manager = await ServiceManager.findOne({ userId: req.params.id });
    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignRoute = async (req, res) => {
  const { routeDetails } = req.body;
  try {
    const updatedManager = await ServiceManager.findOneAndUpdate(
      { userId: req.params.id },
      { $push: { assignedRoutes: routeDetails } },
      { new: true }
    );
    res.json(updatedManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServiceManager,
  assignRoute,
};

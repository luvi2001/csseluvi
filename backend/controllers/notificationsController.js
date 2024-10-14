const Notification = require('../models/notificationsSchema');

// Get all notifications for a resident
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ residentId: req.params.id });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new notification
const createNotification = async (residentId, message) => {
  const notification = new Notification({ residentId, message });

  try {
    const newNotification = await notification.save();
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

module.exports = {
  getNotifications,
  createNotification,
};

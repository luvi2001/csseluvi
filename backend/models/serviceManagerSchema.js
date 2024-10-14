const mongoose = require('mongoose');

const serviceManagerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedRoutes: [{ type: String }],
  reportsGenerated: [
    {
      reportDetails: { type: String },
      generatedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('ServiceManager', serviceManagerSchema);

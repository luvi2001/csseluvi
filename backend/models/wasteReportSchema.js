const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  reportedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WasteReport', wasteReportSchema);

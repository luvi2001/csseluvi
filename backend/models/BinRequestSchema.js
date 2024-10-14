const mongoose = require('mongoose');

const binRequestSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  binType: { type: String, enum: ['Bio', 'Plastic', 'Glass'], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

module.exports = mongoose.model('BinRequest', binRequestSchema);

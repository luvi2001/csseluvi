const mongoose = require('mongoose');

const garbageCollectionRequestSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  residentName: { type: String, required: true },
  residentAddress: { type: String, required: true },
  wasteCollector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // No value in frontend
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
});

module.exports = mongoose.model('GarbageCollectionRequest', garbageCollectionRequestSchema);

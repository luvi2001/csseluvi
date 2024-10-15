const mongoose = require('mongoose');

const binRequestSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  binType: { type: String, enum: ['Bio', 'Plastic', 'Glass','Bulky Item','Paper and Cardboard','Yard Waste','Food Scraps','Extra Trash'], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

module.exports = mongoose.model('BinRequest', binRequestSchema);
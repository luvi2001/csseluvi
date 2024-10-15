//should addthe bar code as an attribute

const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  residentId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  binID: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Bio', 'Plastic', 'Glass'], required: true },
  status: { type: String, enum: ['Active', 'Damaged', 'Full'], required: true },
});

module.exports = mongoose.model('Bin', binSchema);

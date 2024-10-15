// binModel.js
const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binType: {
    type: String,
    enum: ['Bio', 'Plastic', 'Glass', 'Bulky Item', 'Paper and Cardboard', 'Yard Waste', 'Food Scraps', 'Extra Trash'],
    required: true
  },
  residentName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  binFilledStatus: {
    type: String,
    default: 'empty'  // Default status is 'empty'
  },
  qrCode: {
    type: String,  // QR code as a string (URL or base64)
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }});

module.exports = mongoose.model('Binss', binSchema);

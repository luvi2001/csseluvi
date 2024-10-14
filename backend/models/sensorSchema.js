const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  sensorID: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], required: true },
  wasteLevel: { type: Number, required: true }, // Percentage of waste level (e.g., 0 - 100)
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sensor', sensorSchema);

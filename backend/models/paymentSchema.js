const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
});

module.exports = mongoose.model('Payment', paymentSchema);

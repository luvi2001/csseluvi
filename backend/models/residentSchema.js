const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, default: null },
  paymentDetails: {
    cardNumber: { type: String, default: null }, // Storing card number
    expiryDate: { type: String, default: null }, // Storing expiry date
    cvc: { type: String, default: null }, // Storing CVC
    billingAddress: { type: String, default: null } // Optional billing address
  },
  binRequests: [
    {
      binType: { type: String, enum: ['Bio', 'Plastic', 'Glass','Bulky Item','Paper and Cardboard','Yard Waste','Food Scraps','Extra Trash'], required: true, default: null },
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    }
  ],
  bins: [
    {
      binID:{ type: String, required: true},
      binType:{ type: String, enum: ['Bio', 'Plastic', 'Glass'], required: true , default: null},
      status: { type: String, enum: ['Active', 'Damaged', 'Full'], required: true , default: 'Active'}
    }  
  ],
  wasteReports: [
    {
      description: { type: String, required: true, default: null },
      status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    }
  ],
});

module.exports = mongoose.model('Resident', residentSchema);

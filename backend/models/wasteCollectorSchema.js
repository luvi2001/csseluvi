const mongoose = require('mongoose');

const wasteCollectorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeDetails: { type: String, required: true },
  scannedBins: [
    {
      binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
      status: { type: String, enum: ['Collected', 'Missed'], default: 'Collected' }
    }
  ],
  collectionReports: [
    {
      binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
      collectedAt: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model('WasteCollector', wasteCollectorSchema);

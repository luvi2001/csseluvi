const WasteCollector = require('../models/wasteReportSchema');
const Bin = require('../models/BinSchema');

const getWasteCollector = async (req, res) => {
  try {
    const collector = await WasteCollector.findOne({ userId: req.params.id });
    res.json(collector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRouteDetails = async (req, res) => {
  try {
    const updatedCollector = await WasteCollector.findByIdAndUpdate(req.params.id, { routeDetails: req.body.routeDetails }, { new: true });
    res.json(updatedCollector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scanBin = async (req, res) => {
  const { binId, status } = req.body;
  try {
    const bin = await Bin.findById(binId);
    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    const collector = await WasteCollector.findOneAndUpdate(
      { userId: req.params.id },
      { $push: { scannedBins: { binId, status } } },
      { new: true }
    );

    res.json(collector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWasteCollector,
  updateRouteDetails,
  scanBin,
};

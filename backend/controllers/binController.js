const Bin = require('../models/BinSchema');

const getBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    res.json(bin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBin = async (req, res) => {
  const { binID, location, type, status } = req.body;
  const bin = new Bin({ binID, location, type, status });

  try {
    const newBin = await bin.save();
    res.status(201).json(newBin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBinStatus = async (req, res) => {
  try {
    const updatedBin = await Bin.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updatedBin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBin,
  createBin,
  updateBinStatus,
};

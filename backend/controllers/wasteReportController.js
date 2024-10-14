const WasteReport = require('../models/wasteReportSchema');

const getWasteReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWasteReport = async (req, res) => {
  const { residentId, description } = req.body;
  const report = new WasteReport({ residentId, description });
  
  try {
    const newReport = await report.save();

    await createNotification(req.params.id, `Your waste issue report has been submitted.`);

    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getWasteReport,
  createWasteReport,
};

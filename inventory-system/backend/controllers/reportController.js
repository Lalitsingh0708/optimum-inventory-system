const Spare = require('../models/Spare');
const { calculateEOQ } = require('../utils/eoqCalculator');

exports.getReorderReport = async (req, res, next) => {
  try {
    const spares = await Spare.find({ $expr: { $lte: ["$currentStock", "$minimumStock"] } });
    
    const reportList = spares.map(spare => {
      const { eoq, reorderPoint } = calculateEOQ(spare);
      return {
        id: spare._id,
        name: spare.name,
        partNumber: spare.partNumber,
        currentStock: spare.currentStock,
        minimumStock: spare.minimumStock,
        suggestedOrderQuantity: eoq,
        reorderPoint
      };
    });
    
    res.status(200).json(reportList);
  } catch (error) { next(error); }
};

exports.getInventoryValuation = async (req, res, next) => {
    try {
        const spares = await Spare.find();
        const totalValue = spares.reduce((acc, spare) => acc + (spare.currentStock * spare.unitPrice), 0);
        res.status(200).json({ totalValue, itemCount: spares.length });
    } catch (error) { next(error); }
};

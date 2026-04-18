const Spare = require('../models/Spare');
const { calculateEOQ } = require('../utils/eoqCalculator');

exports.getSpares = async (req, res, next) => {
  try {
    const spares = await Spare.find().populate('supplier', 'name');
    res.status(200).json(spares);
  } catch (error) { next(error); }
};

exports.createSpare = async (req, res, next) => {
  try {
    const spare = await Spare.create(req.body);
    res.status(201).json(spare);
  } catch (error) { next(error); }
};

exports.updateSpare = async (req, res, next) => {
  try {
    const spare = await Spare.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!spare) { res.status(404); throw new Error('Spare not found'); }
    res.status(200).json(spare);
  } catch (error) { next(error); }
};

exports.deleteSpare = async (req, res, next) => {
  try {
    const spare = await Spare.findById(req.params.id);
    if(!spare) { res.status(404); throw new Error('Spare not found'); }
    await spare.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) { next(error); }
};

exports.getLowStock = async (req, res, next) => {
  try {
    const spares = await Spare.find({ $expr: { $lte: ["$currentStock", "$minimumStock"] } });
    res.status(200).json(spares);
  } catch (error) { next(error); }
};

exports.getEOQ = async (req, res, next) => {
  try {
    const spare = await Spare.findById(req.params.id);
    if(!spare) { res.status(404); throw new Error('Spare not found'); }
    const eoqData = calculateEOQ(spare);
    res.status(200).json(eoqData);
  } catch (error) { next(error); }
};

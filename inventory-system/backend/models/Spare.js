const mongoose = require('mongoose');

const spareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partNumber: { type: String, required: true, unique: true },
  machineCategory: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, default: 'assets/images/default_spare.png' },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  // Inventory tracking
  currentStock: { type: Number, default: 0 },
  minimumStock: { type: Number, default: 10 },
  unitPrice: { type: Number, required: true },
  // EOQ Data
  annualDemand: { type: Number, default: 0 }, // D
  orderingCost: { type: Number, default: 0 }, // S
  holdingCost: { type: Number, default: 0 }, // H based on percentage of unit price or flat fee
  leadTimeDays: { type: Number, default: 0 },
  demandStdDev: { type: Number, default: 0 },
  serviceLevelZ: { type: Number, default: 1.645 }, // default 95%
  safetyStock: { type: Number, default: 0 },
  reorderPoint: { type: Number, default: 0 },
  abcClass: { type: String, enum: ['A', 'B', 'C', ''], default: '' },
  vedClass: { type: String, enum: ['Vital', 'Essential', 'Desirable', ''], default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Spare', spareSchema);

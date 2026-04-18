const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  machineName: { type: String, required: true },
  operatingCity: { type: String, required: true },
  installationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Maintenance', 'Decommissioned'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);

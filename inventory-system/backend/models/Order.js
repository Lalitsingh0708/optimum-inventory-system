const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sparePart: { type: mongoose.Schema.Types.ObjectId, ref: 'Spare', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  quantityOrdered: { type: Number, required: true },
  agreedPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Received'], default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

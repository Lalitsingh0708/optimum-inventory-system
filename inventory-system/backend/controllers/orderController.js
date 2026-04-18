const Order = require('../models/Order');
const Spare = require('../models/Spare');
const { sendRefundEmail } = require('../utils/mailer');

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) { next(error); }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const { sparePart, supplier, quantityOrdered, agreedPrice, razorpayOrderId, razorpayPaymentId } = req.body;
    const order = await Order.create({ sparePart, supplier, quantityOrdered, agreedPrice, razorpayOrderId, razorpayPaymentId });
    res.status(201).json(order);
  } catch (error) { next(error); }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('sparePart', 'name partNumber imageUrl')
      .populate('supplier', 'name contactPerson email');
    res.status(200).json(orders);
  } catch (error) { next(error); }
};

exports.receiveOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order) { res.status(404); throw new Error('Order not found'); }
    if(order.status === 'Received') {
      res.status(400); throw new Error('Order is already received');
    }

    // Mark as received
    order.status = 'Received';
    await order.save();

    // Increment stock
    const spare = await Spare.findById(order.sparePart);
    if(spare) {
      spare.currentStock += order.quantityOrdered;
      await spare.save();
    }

    res.status(200).json(order);
  } catch (error) { next(error); }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order) { res.status(404); throw new Error('Order not found'); }
    await order.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) { next(error); }
};

/**
 * POST /api/orders/:id/refund
 * Sends a refund request email to the supplier email, then deletes the order.
 * Body: { reason } (optional)
 */
exports.sendRefundAndDiscard = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('sparePart', 'name partNumber')
      .populate('supplier', 'name contactPerson email');

    if (!order) { res.status(404); throw new Error('Order not found'); }

    const supplier = order.supplier;
    if (!supplier || !supplier.email) {
      return res.status(400).json({ message: 'Supplier has no email address on record. Please update supplier info before sending refund.' });
    }

    const { reason } = req.body;

    // Send the refund email
    await sendRefundEmail({
      supplierEmail:    supplier.email,
      supplierName:     supplier.name,
      contactPerson:    supplier.contactPerson,
      orderId:          order._id.toString(),
      spareName:        order.sparePart ? order.sparePart.name : 'Unknown Part',
      quantityOrdered:  order.quantityOrdered,
      amount:           order.agreedPrice,
      razorpayOrderId:  order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      reason
    });

    // Delete the order after email is sent
    await order.deleteOne();

    res.status(200).json({
      message: `Refund email sent to ${supplier.email} and order discarded.`,
      id: req.params.id
    });
  } catch (error) { next(error); }
};

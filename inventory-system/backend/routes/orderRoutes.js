const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, receiveOrder, deleteOrder, createRazorpayOrder, sendRefundAndDiscard } = require('../controllers/orderController');

router.route('/razorpay').post(createRazorpayOrder);
router.route('/').get(getOrders).post(placeOrder);
router.route('/:id').delete(deleteOrder);
router.route('/:id/receive').put(receiveOrder);
router.route('/:id/refund').post(sendRefundAndDiscard);

module.exports = router;

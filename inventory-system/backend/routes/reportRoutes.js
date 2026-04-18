const express = require('express');
const router = express.Router();
const { getReorderReport, getInventoryValuation } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.route('/reorder').get(protect, getReorderReport);
router.route('/valuation').get(protect, getInventoryValuation);

module.exports = router;

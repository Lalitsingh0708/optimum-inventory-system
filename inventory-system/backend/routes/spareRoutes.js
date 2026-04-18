const express = require('express');
const router = express.Router();
const { getSpares, createSpare, updateSpare, deleteSpare, getLowStock, getEOQ } = require('../controllers/spareController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getSpares).post(createSpare);
router.route('/low-stock').get(getLowStock);
router.route('/:id').put(updateSpare).delete(deleteSpare);
router.route('/:id/eoq').get(getEOQ);

module.exports = router;

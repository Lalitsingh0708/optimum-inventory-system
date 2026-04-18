const express = require('express');
const router = express.Router();
const { getMachines, createMachine, deleteMachine } = require('../controllers/machineController');

router.route('/').get(getMachines).post(createMachine);
router.route('/:id').delete(deleteMachine);

module.exports = router;


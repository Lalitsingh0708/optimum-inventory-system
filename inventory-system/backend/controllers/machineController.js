const Machine = require('../models/Machine');

// @desc    Get all machines
// @route   GET /api/machines
// @access  Public
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new machine
// @route   POST /api/machines
// @access  Public
const createMachine = async (req, res) => {
  try {
    const { machineName, operatingCity, status } = req.body;
    
    if (!machineName || !operatingCity) {
      return res.status(400).json({ message: 'Please add a machine name and operating city' });
    }

    const machine = await Machine.create({
      machineName,
      operatingCity,
      status: status || 'Active'
    });

    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a machine
// @route   DELETE /api/machines/:id
// @access  Public
const deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    await Machine.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Machine deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMachines,
  createMachine,
  deleteMachine,
};

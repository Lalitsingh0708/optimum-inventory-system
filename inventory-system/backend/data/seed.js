const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Spare = require('../models/Spare');
const connectDB = require('../config/db');

dotenv.config({ path: '../.env' });
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Supplier.deleteMany();
    await Spare.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);

    const createdUsers = await User.create([
      { name: 'Admin User', email: 'admin@inventory.com', password, role: 'Admin' }
    ]);

    const createdSuppliers = await Supplier.create([
      { name: 'Global Tech Spares', contactPerson: 'John Doe', email: 'john@globaltech.com', phone: '1234567890' },
      { name: 'Industrial Parts Inc.', contactPerson: 'Jane Smith', email: 'jane@iparts.com', phone: '0987654321' },
      { name: 'Advanced Engineering Solutions', contactPerson: 'Mike Ross', email: 'mike@aes.com', phone: '5551234567' }
    ]);

    const itemsToCreate = [];

    // 1. Hydraulic Piston 
    itemsToCreate.push({
        name: 'Hydraulic Piston M4', partNumber: 'HYD-001-M4', machineCategory: 'Hydraulic Press', description: 'Main pressure piston unit.',
        imageUrl: 'assets/images/spare_piston.png',
        supplier: createdSuppliers[0]._id, currentStock: 5, minimumStock: 10, unitPrice: 1500,
        annualDemand: 120, orderingCost: 50, holdingCost: 300, leadTimeDays: 7
    });

    // 2. Conveyor Belt
    itemsToCreate.push({
        name: 'Conveyor Belt Rubber 2M', partNumber: 'CNV-BELT-2M', machineCategory: 'Conveyor System', description: 'Heavy duty 2 meter thick rubber belt.',
        imageUrl: 'assets/images/spare_belt.png',
        supplier: createdSuppliers[1]._id, currentStock: 25, minimumStock: 15, unitPrice: 200,
        annualDemand: 300, orderingCost: 40, holdingCost: 20, leadTimeDays: 3
    });

    // 3. Milling Cutter
    itemsToCreate.push({
        name: 'CNC Milling Cutter 5mm Titanium', partNumber: 'CNC-MC-5MM-TI', machineCategory: 'CNC Machine', description: 'Precision titanium milling cutter drill bit.',
        imageUrl: 'assets/images/spare_cutter.png',
        supplier: createdSuppliers[0]._id, currentStock: 2, minimumStock: 50, unitPrice: 45,
        annualDemand: 1000, orderingCost: 20, holdingCost: 2, leadTimeDays: 14
    });

    // Add extra dummy items directly without images to make it scrollable
    for(let i=4; i<=15; i++) {
        itemsToCreate.push({
            name: `Generic Spare Part V${i}`, partNumber: `GEN-0${i}-X`, machineCategory: i % 2 === 0 ? 'Conveyor System' : 'CNC Machine', 
            description: `A standard generic spare part for industrial replacement. Specs version ${i}.`,
            imageUrl: i % 3 === 0 ? 'assets/images/spare_piston.png' : (i % 2 === 0 ? 'assets/images/spare_belt.png' : 'assets/images/spare_cutter.png'),
            supplier: createdSuppliers[i % 3]._id, currentStock: Math.floor(Math.random() * 50), minimumStock: 15, unitPrice: 10 * i,
            annualDemand: 500 + (10 * i), orderingCost: 25, holdingCost: 10, leadTimeDays: Math.floor(Math.random() * 10) + 1
        });
    }

    await Spare.create(itemsToCreate);

    console.log('Data Imported successfully with multiple data sets!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();

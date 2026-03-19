const express = require('express');
const VehicleRecord = require('../models/VehicleRecord');

const router = express.Router();

// Get all records
router.get('/', async (req, res) => {
  try {
    const records = await VehicleRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error('Error fetching records', err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Create a new record
router.post('/', async (req, res) => {
  try {
    const {
      vehicle = '',
      reg = '',
      owner = '',
      mobile = '',
      mileage = '',
      parts = '',
      date = '',
      addInfo = '',
    } = req.body;

    if (!reg) {
      return res.status(400).json({ error: 'Registration number is required' });
    }

    const record = new VehicleRecord({
      vehicle,
      reg,
      owner,
      mobile,
      mileage: mileage !== '' ? Number(mileage) : undefined,
      parts,
      date: date ? new Date(date) : undefined,
      addInfo,
    });

    await record.save();

    res.status(201).json(record);
  } catch (err) {
    console.error('Error creating record', err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

module.exports = router;

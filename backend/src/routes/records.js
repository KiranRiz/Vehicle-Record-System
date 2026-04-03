const express = require('express');
const VehicleRecord = require('../models/VehicleRecord');

const router = express.Router();

// Get all records
router.get('/', async (req, res) => {
  try {
    const records = await VehicleRecord.find().sort({ createdAt: -1 }).lean();
    const normalized = records.map((record) => ({
      ...record,
      agreementName: typeof record.agreementName === 'string' ? record.agreementName : '',
    }));
    res.json(normalized);
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
      agreementName = '',
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
      agreementName: String(agreementName || '').trim(),
    });

    await record.save();

    res.status(201).json(record);
  } catch (err) {
    console.error('Error creating record', err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { addInfo, agreementName } = req.body;
    const update = {};
    if (addInfo !== undefined) update.addInfo = addInfo;
    if (agreementName !== undefined) update.agreementName = agreementName;

    const updated = await VehicleRecord.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: false }
    );
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a record by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await VehicleRecord.findByIdAndDelete(id);
    
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully', deletedRecord });
  } catch (err) {
    console.error('Error deleting record', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

module.exports = router;

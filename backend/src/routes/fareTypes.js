const express = require('express');
const FareType = require('../models/FareType');

const router = express.Router();

// GET all fare types
router.get('/', async (req, res) => {
  try {
    const fareTypes = await FareType.find().sort({ createdAt: -1 });
    res.json(fareTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fare types' });
  }
});

// POST create new fare type
router.post('/', async (req, res) => {
  try {
    const { fareName, fareType, minimumFare, maximumFare } = req.body;
    if (!fareName || !fareType || minimumFare === undefined || maximumFare === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newFareType = new FareType({ fareName, fareType, minimumFare, maximumFare });
    await newFareType.save();
    res.status(201).json(newFareType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create fare type' });
  }
});

// PUT update fare type by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await FareType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Fare type not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update fare type' });
  }
});

// DELETE fare type by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await FareType.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Fare type not found' });
    res.json({ message: 'Fare type deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete fare type' });
  }
});

module.exports = router;
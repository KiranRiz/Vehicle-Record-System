const express = require('express');
const Agreement = require('../models/Agreement');

const router = express.Router();

// GET all agreements
router.get('/', async (req, res) => {
  try {
    const agreements = await Agreement.find().sort({ createdAt: -1 });
    res.json(agreements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch agreements' });
  }
});

// POST create new agreement
router.post('/', async (req, res) => {
  try {
    const { startDate, endDate, agreementName, fareName } = req.body;
    if (!startDate || !endDate || !agreementName || !fareName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const agreement = new Agreement({ startDate, endDate, agreementName, fareName });
    await agreement.save();
    res.status(201).json(agreement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create agreement' });
  }
});

// PUT update agreement
router.put('/:id', async (req, res) => {
  try {
    const updated = await Agreement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Agreement not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update agreement' });
  }
});

// DELETE agreement
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Agreement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Agreement not found' });
    res.json({ message: 'Agreement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete agreement' });
  }
});

module.exports = router;
const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST create a new user
router.post('/', async (req, res) => {
  try {
    const { userName, userRegNo, mobile, assignDate, vehicleReg } = req.body;

    if (!userName || !userRegNo || !mobile || !assignDate || !vehicleReg) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = new User({
      userName,
      userRegNo,
      mobile,
      assignDate: new Date(assignDate),
      vehicleReg
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET single user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
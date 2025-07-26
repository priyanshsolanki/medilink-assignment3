// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const User = require('../models/User');

router.get('/', auth, role('admin'), async (req, res) => {
  const users = await User.find().select('-password -mfaSecret');
  res.json(users);
});
router.get('/patients', auth, async (req, res) => {
  try {
    const patients = await User
      .find({ role: 'patient' })
      .select('name email dob gender createdAt')
      .lean();
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients', error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User
      .find({ role: 'doctor' })
      .select('name specialty rating experience location image fee')
      .lean();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

router.get('/:userId', auth, async (req, res) => {
  try {
      const { userId } = req.params;

      // Authorization check
      const requestedUser = await User.findById(userId);
      if (!requestedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Allow access to own profile, doctors (for patients), or admins
      if (req.user.userId !== userId && req.user.role !== 'doctor' && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden: insufficient rights' });
      }

      // Additional check: doctors can only access patient profiles, not other doctors
      if (req.user.role === 'doctor' && requestedUser.role === 'doctor' && req.user.userId !== userId) {
          return res.status(403).json({ message: 'Doctors cannot access other doctor profiles' });
      }
      // Return basic user info (excluding sensitive data like password)
      const userInfo = {
          id: requestedUser._id,
          name: requestedUser.name,
          email: requestedUser.email,
          role: requestedUser.role,
          gender: requestedUser.gender,
          dob: requestedUser.dob,
      };

      res.json(userInfo);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

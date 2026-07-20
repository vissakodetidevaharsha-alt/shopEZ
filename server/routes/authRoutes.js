const express = require('express');
const router = express.Router();
const {
  register,
  login,
  profile,
  updateProfile,
  getUsers,
  deleteUser
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile);
router.put('/profile', protect, updateProfile);

// Admin-only User Management routes
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUsers, getUserProfile, updateUserProfile, createUser, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.route('/admin').post(protect, admin, createUser);
router.post('/login', authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).put(protect, admin, updateUserRole);

module.exports = router;

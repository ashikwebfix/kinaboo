const express = require('express');
const router = express.Router();
const { testFcmNotification, authUser, registerUser, getUsers, getUserProfile, updateUserProfile, createUser, deleteUser, updateUserRole, updateFcmToken } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.route('/admin').post(protect, admin, createUser);
router.post('/login', authUser);
router.post('/test-fcm', protect, admin, testFcmNotification);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.put('/fcm-token', protect, updateFcmToken);
router.route('/:id').delete(protect, admin, deleteUser).put(protect, admin, updateUserRole);

module.exports = router;

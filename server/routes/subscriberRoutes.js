const express = require('express');
const router = express.Router();
const { addSubscriber, getSubscribers, deleteSubscriber } = require('../controllers/subscriberController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(addSubscriber)
  .get(protect, admin, getSubscribers);

router.route('/:id')
  .delete(protect, admin, deleteSubscriber);

module.exports = router;

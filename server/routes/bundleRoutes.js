const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getBundles,
  getBundleById,
  getBundlesByProductId,
  createBundle,
  updateBundle,
  deleteBundle
} = require('../controllers/bundleController');

router.route('/')
  .get(getBundles)
  .post(protect, admin, createBundle);

router.route('/product/:productId')
  .get(getBundlesByProductId);

router.route('/:id')
  .get(getBundleById)
  .put(protect, admin, updateBundle)
  .delete(protect, admin, deleteBundle);

module.exports = router;

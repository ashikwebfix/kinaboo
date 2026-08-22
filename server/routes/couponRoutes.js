const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, toggleCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id/toggle', protect, admin, toggleCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

// Public route for checkout validation
router.post('/validate', validateCoupon);

module.exports = router;

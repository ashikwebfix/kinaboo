const express = require('express');
const router = express.Router();
const { trackCart, getAbandonedCarts } = require('../controllers/abandonedCartController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/track', trackCart);
router.get('/', protect, admin, getAbandonedCarts);

module.exports = router;

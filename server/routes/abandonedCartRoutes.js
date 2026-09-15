const express = require('express');
const router = express.Router();
const { trackCart, getAbandonedCarts, transferToOrder } = require('../controllers/abandonedCartController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/track', trackCart);
router.get('/', protect, admin, getAbandonedCarts);
router.post('/:id/transfer', protect, admin, transferToOrder);

module.exports = router;

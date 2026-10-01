const express = require('express');
const router = express.Router();
const { trackCart, getAbandonedCarts, transferToOrder, removeCart } = require('../controllers/abandonedCartController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/track', trackCart);
router.get('/', protect, admin, getAbandonedCarts);
router.post('/:id/transfer', protect, admin, transferToOrder);
router.put('/:id/remove', protect, admin, removeCart);

module.exports = router;

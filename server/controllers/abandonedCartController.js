const AbandonedCart = require('../models/AbandonedCart');
const { Op } = require('sequelize');

// Track or update abandoned cart
const trackCart = async (req, res) => {
  try {
    const { phone, name, cartData, totalValue } = req.body;

    if (!phone || !cartData) {
      return res.status(400).json({ message: 'Phone and cart data are required' });
    }

    // Find if an abandoned cart exists for this phone
    let cart = await AbandonedCart.findOne({ where: { phone } });

    if (cart) {
      // If it exists and was recovered, maybe we create a new one, but for simplicity, we just reset it to abandoned
      cart.name = name || cart.name;
      cart.cartData = cartData;
      cart.totalValue = totalValue;
      cart.status = 'abandoned';
      await cart.save();
    } else {
      cart = await AbandonedCart.create({
        phone,
        name,
        cartData,
        totalValue,
        status: 'abandoned'
      });
    }

    res.status(200).json({ message: 'Cart tracked', cart });
  } catch (error) {
    console.error('Error tracking abandoned cart:', error);
    res.status(500).json({ message: 'Failed to track cart' });
  }
};

// Get all abandoned carts for Admin
const getAbandonedCarts = async (req, res) => {
  try {
    const carts = await AbandonedCart.findAll({
      order: [['updatedAt', 'DESC']]
    });
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    res.status(500).json({ message: 'Failed to fetch abandoned carts' });
  }
};

module.exports = {
  trackCart,
  getAbandonedCarts
};

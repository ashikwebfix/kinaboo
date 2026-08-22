const Coupon = require('../models/Coupon');

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { 
      code, discountType, discountValue, startDate, endDate, 
      usageLimit, minPurchaseAmount, applicableProducts, applicableCategories, applicableCustomers 
    } = req.body;
    
    const couponExists = await Coupon.findOne({ where: { code } });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon already exists' });
    }
    const coupon = await Coupon.create({ 
      code, discountType, discountValue, startDate, endDate, 
      usageLimit, minPurchaseAmount, applicableProducts, applicableCategories, applicableCustomers
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const toggleCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    
    await coupon.destroy();
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, items, userEmail } = req.body;
    const coupon = await Coupon.findOne({ where: { code } });
    
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ message: 'Coupon is no longer active' });

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return res.status(400).json({ message: 'Coupon is not yet active' });
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (coupon.minPurchaseAmount && cartTotal < Number(coupon.minPurchaseAmount)) {
      return res.status(400).json({ message: `Minimum purchase amount of ${coupon.minPurchaseAmount} BDT is required` });
    }

    if (coupon.applicableCustomers && coupon.applicableCustomers.length > 0) {
      if (!userEmail || !coupon.applicableCustomers.includes(userEmail)) {
        return res.status(400).json({ message: 'Coupon is not applicable to your account' });
      }
    }

    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      // Check if at least one item in the cart is in the applicableProducts array
      const hasApplicableProduct = items && items.some(item => coupon.applicableProducts.includes(item.id || item.productId));
      if (!hasApplicableProduct) {
        return res.status(400).json({ message: 'Coupon is not applicable to any items in your cart' });
      }
    }

    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = items && items.some(item => coupon.applicableCategories.includes(item.category));
      if (!hasApplicableCategory) {
        return res.status(400).json({ message: 'Coupon is not applicable to any item categories in your cart' });
      }
    }
    
    res.json({ 
      discountType: coupon.discountType || 'percentage', 
      discountValue: coupon.discountValue || coupon.discountPercentage || 0, // Fallback to discountPercentage for legacy
      code: coupon.code 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getCoupons, createCoupon, toggleCoupon, deleteCoupon, validateCoupon };

const AbandonedCart = require('../models/AbandonedCart');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Setting = require('../models/Setting');
const axios = require('axios');
const crypto = require('crypto');
const { Op } = require('sequelize');

const hashData = (data) => {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

// Track or update abandoned cart
const trackCart = async (req, res) => {
  try {
    const { phone, name, cartData, totalValue, fbp, fbc } = req.body;

    if (!phone || !cartData) {
      return res.status(400).json({ message: 'Phone and cart data are required' });
    }

    let finalClientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    if (finalClientIp === '::1' || finalClientIp === '127.0.0.1') finalClientIp = '1.1.1.1';
    
    const userAgent = req.headers['user-agent'] || '';

    // Find if an abandoned cart exists for this phone
    let cart = await AbandonedCart.findOne({ where: { phone } });

    if (cart) {
      cart.name = name || cart.name;
      cart.cartData = cartData;
      cart.totalValue = totalValue;
      cart.status = 'abandoned';
      cart.ipAddress = finalClientIp;
      cart.userAgent = userAgent;
      cart.fbp = fbp;
      cart.fbc = fbc;
      await cart.save();
    } else {
      cart = await AbandonedCart.create({
        phone,
        name,
        cartData,
        totalValue,
        status: 'abandoned',
        ipAddress: finalClientIp,
        userAgent,
        fbp,
        fbc
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
      where: { status: 'abandoned' },
      order: [['updatedAt', 'DESC']]
    });
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    res.status(500).json({ message: 'Failed to fetch abandoned carts' });
  }
};

const transferToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name,
      shippingAddress, 
      city, 
      postalCode, 
      paymentMethod,
      shippingCost,
      discount,
      couponCode
    } = req.body;

    const cart = await AbandonedCart.findByPk(id);
    
    if (!cart) {
      return res.status(404).json({ message: 'Abandoned cart not found' });
    }

    const orderItems = cart.cartData;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in abandoned cart' });
    }
    
    const totalPrice = cart.totalValue;

    const Product = require('../models/Product');
    const validProducts = await Product.findAll({
      where: { id: orderItems.map(item => item.productId || item.id) }
    });
    const validProductIds = validProducts.map(p => p.id);

    const validOrderItems = orderItems.filter(item => validProductIds.includes(item.productId || item.id));

    if (validOrderItems.length === 0) {
      return res.status(400).json({ message: 'All products in this cart have been deleted from the store.' });
    }

    // Recalculate total price based on valid items
    const newTotal = validOrderItems.reduce((acc, item) => acc + (Number(item.price || item.sellPrice) * item.qty), 0);

    // Create the order
    const order = await Order.create({
      userId: null,
      name: name || cart.name || 'Unknown',
      phone: cart.phone,
      shippingAddress,
      city,
      postalCode,
      ipAddress: cart.ipAddress,
      userAgent: cart.userAgent,
      totalPrice: Number(newTotal) - Number(discount || 0) + Number(shippingCost || 0),
      paymentMethod: paymentMethod || 'Cash on Delivery',
      shippingCost: shippingCost || 0.0,
      discount: discount || 0.0,
      couponCode: couponCode || null,
      status: 'Pending',
      statusLogs: [{
        status: 'Pending',
        date: new Date().toISOString(),
        note: 'Order transferred from abandoned cart'
      }]
    });

    const orderItemsData = validOrderItems.map((item) => ({
      orderId: order.id,
      productId: item.productId || item.id,
      qty: item.qty,
      price: item.price || item.sellPrice,
      selectedVariations: item.selectedVariations || null
    }));

    await OrderItem.bulkCreate(orderItemsData);

    if (couponCode) {
      const Coupon = require('../models/Coupon');
      const coupon = await Coupon.findOne({ where: { code: couponCode } });
      if (coupon) {
        coupon.usedCount = (coupon.usedCount || 0) + 1;
        await coupon.save();
      }
    }

    // Facebook CAPI (Server-Side Tracking)
    try {
      const trackingSetting = await Setting.findOne({ where: { key: 'tracking_settings' } });
      if (trackingSetting && trackingSetting.value) {
        
        let pixels = trackingSetting.value.fbPixels || [];
        if (pixels.length === 0 && trackingSetting.value.fbPixelId && trackingSetting.value.fbCapiToken) {
          pixels = [{
            pixelId: trackingSetting.value.fbPixelId,
            capiToken: trackingSetting.value.fbCapiToken,
            testEventCode: trackingSetting.value.fbTestEventCode
          }];
        }
        
        // Fetch Category CAPI tokens
        const productIds = orderItemsData.map(item => item.productId);
        const products = await Product.findAll({ where: { id: productIds }, attributes: ['category'] });
        const categoryNames = [...new Set(products.map(p => p.category).filter(Boolean))];
        if (categoryNames.length > 0) {
          const Category = require('../models/Category');
          const categories = await Category.findAll({ where: { title: categoryNames } });
          categories.forEach(cat => {
            if (cat.fbPixelId && cat.fbCapiToken) {
              if (!pixels.find(p => p.pixelId === cat.fbPixelId)) {
                pixels.push({
                  pixelId: cat.fbPixelId,
                  capiToken: cat.fbCapiToken,
                  testEventCode: trackingSetting.value.fbTestEventCode || ''
                });
              }
            }
          });
        }
        
        if (pixels.length > 0) {
          // Parse Name
          const nameParts = cart.name ? cart.name.trim().split(/\s+/) : [];
          let fnHash = [], lnHash = [];
          if (nameParts.length > 0) {
            fnHash.push(hashData(nameParts[0]));
            if (nameParts.length > 1) {
              lnHash.push(hashData(nameParts.slice(1).join(' ')));
            }
          }

          const promises = pixels.map(async (pixel) => {
            if (!pixel.pixelId || !pixel.capiToken) return;

            const eventData = {
              data: [
                {
                  event_name: 'Purchase',
                  event_time: Math.floor(Date.now() / 1000),
                  event_id: 'purchase_' + order.id,
                  action_source: 'website',
                  event_source_url: `${process.env.FRONTEND_URL || 'http://localhost:6711'}/checkout`,
                  user_data: {
                    client_user_agent: cart.userAgent,
                    client_ip_address: cart.ipAddress || '1.1.1.1',
                    ph: cart.phone ? [hashData(cart.phone)] : [],
                    fn: fnHash,
                    ln: lnHash,
                    ct: city ? [hashData(city)] : [],
                    zp: postalCode ? [hashData(postalCode)] : [],
                    country: [hashData('bd')],
                    fbp: cart.fbp || undefined,
                    fbc: cart.fbc || undefined
                  },
                  custom_data: {
                    currency: 'BDT',
                    value: order.totalPrice,
                    content_ids: orderItemsData.map(item => item.productId.toString()),
                    content_type: 'product',
                    order_id: order.id
                  }
                }
              ]
            };

            if (pixel.testEventCode && pixel.testEventCode.trim() !== '') {
              eventData.test_event_code = pixel.testEventCode.trim();
            }

            try {
              await axios.post(`https://graph.facebook.com/v17.0/${pixel.pixelId}/events?access_token=${pixel.capiToken}`, eventData);
              console.log(`FB CAPI Purchase Event Sent for Pixel ${pixel.pixelId} on cart transfer`);
            } catch (fbError) {
              console.error(`FB CAPI Error for Pixel ${pixel.pixelId}:`, fbError.response ? fbError.response.data : fbError.message);
            }
          });

          await Promise.allSettled(promises);
        }
      }
    } catch (fbError) {
      console.error('FB CAPI Error on transfer:', fbError.message);
    }

    // After successfully creating order and doing tracking, destroy the abandoned cart
    await cart.destroy();

    res.status(201).json({ message: 'Cart transferred to order successfully', order });
  } catch (error) {
    console.error('Error transferring abandoned cart to order:', error);
    res.status(500).json({ message: 'Failed to transfer to order' });
  }
};

module.exports = {
  trackCart,
  getAbandonedCarts,
  transferToOrder
};

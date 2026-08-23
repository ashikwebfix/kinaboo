const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const Setting = require('../models/Setting');
const axios = require('axios');
const crypto = require('crypto');

// Helper to hash user data for FB CAPI
const hashData = (data) => {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

const AbandonedCart = require('../models/AbandonedCart');

const addOrderItems = async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    city, 
    postalCode, 
    totalPrice,
    name,
    phone,
    paymentMethod,
    shippingCost,
    discount,
    couponCode
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    try {
      const clientIp = req.ip;
      const clientUserAgent = req.headers['user-agent'] || '';

      // Fraud Protection Check
      const fraudSetting = await Setting.findOne({ where: { key: 'fraud_protection' } });
      if (fraudSetting && fraudSetting.value && fraudSetting.value.enabled) {
        const { blockTimePhone, blockTimeIp } = fraudSetting.value;
        const phoneMinutes = parseInt(blockTimePhone) || 5;
        const ipMinutes = parseInt(blockTimeIp) || 5;

        const phoneTimeThreshold = new Date(Date.now() - phoneMinutes * 60 * 1000);
        const ipTimeThreshold = new Date(Date.now() - ipMinutes * 60 * 1000);

        const { Op } = require('sequelize');

        // Check Phone & Same Product
        const recentPhoneOrders = await Order.findAll({
          where: {
            phone,
            createdAt: { [Op.gte]: phoneTimeThreshold }
          },
          include: [{ model: OrderItem, as: 'orderItems' }]
        });
        
        for (const o of recentPhoneOrders) {
          const matchingProduct = o.orderItems.find(i => orderItems.some(reqItem => reqItem.productId === i.productId));
          if (matchingProduct) {
            return res.status(400).json({ message: 'Duplicate order detected based on phone number. Please wait before ordering again.' });
          }
        }

        // Check IP & Browser
        const recentIpOrders = await Order.findAll({
          where: {
            ipAddress: clientIp,
            userAgent: clientUserAgent,
            createdAt: { [Op.gte]: ipTimeThreshold }
          }
        });
        
        if (recentIpOrders.length > 0) {
          return res.status(400).json({ message: 'Duplicate order detected based on network activity. Please wait before ordering again.' });
        }
      }

      // Create the order
      // We allow guest checkouts if userId is not present
      const userId = req.user ? req.user.id : null;

      const order = await Order.create({
        userId,
        name,
        phone,
        shippingAddress,
        city,
        postalCode,
        ipAddress: clientIp,
        userAgent: clientUserAgent,
        totalPrice,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        shippingCost: shippingCost || 0.0,
        discount: discount || 0.0,
        couponCode: couponCode || null,
        status: 'Pending',
        statusLogs: [{
          status: 'Pending',
          date: new Date().toISOString(),
          note: 'Order placed'
        }]
      });

      const orderItemsData = orderItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        qty: item.qty,
        price: item.price,
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

      // Mark abandoned cart as recovered
      if (phone) {
        await AbandonedCart.update(
          { status: 'recovered' },
          { where: { phone, status: 'abandoned' } }
        );
      }

      // Facebook CAPI (Server-Side Tracking)
      try {
        const trackingSetting = await Setting.findOne({ where: { key: 'tracking_settings' } });
        if (trackingSetting && trackingSetting.value) {
          const { fbPixelId, fbCapiToken, fbTestEventCode } = trackingSetting.value;
          
          if (fbPixelId && fbCapiToken) {
            
            // Format IP for FB (avoid local IPs)
            let finalClientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
            if (finalClientIp === '::1' || finalClientIp === '127.0.0.1') finalClientIp = '1.1.1.1';

            // Parse Name
            const nameParts = name ? name.trim().split(/\s+/) : [];
            let fnHash = [], lnHash = [];
            if (nameParts.length > 0) {
              fnHash.push(hashData(nameParts[0]));
              if (nameParts.length > 1) {
                lnHash.push(hashData(nameParts.slice(1).join(' ')));
              }
            }

            const eventData = {
              data: [
                {
                  event_name: 'Purchase',
                  event_time: Math.floor(Date.now() / 1000),
                  event_id: `purchase_${order.id}`,
                  action_source: 'website',
                  event_source_url: `${process.env.FRONTEND_URL || 'http://localhost:6711'}/checkout`,
                  user_data: {
                    client_user_agent: req.headers['user-agent'],
                    client_ip_address: finalClientIp,
                    em: req.user && req.user.email ? [hashData(req.user.email)] : [],
                    ph: phone ? [hashData(phone)] : [],
                    fn: fnHash,
                    ln: lnHash,
                    ct: city ? [hashData(city)] : [],
                    zp: postalCode ? [hashData(postalCode)] : [],
                    country: [hashData('bd')]
                  },
                  custom_data: {
                    currency: 'BDT',
                    value: totalPrice,
                    content_ids: orderItems.map(item => item.productId.toString()),
                    content_type: 'product',
                    order_id: order.id
                  }
                }
              ]
            };

            if (fbTestEventCode && fbTestEventCode.trim() !== '') {
              eventData.test_event_code = fbTestEventCode.trim();
            }

            await axios.post(`https://graph.facebook.com/v17.0/${fbPixelId}/events?access_token=${fbCapiToken}`, eventData);
            console.log('FB CAPI Purchase Event Sent');
          }
        }
      } catch (fbError) {
        console.error('FB CAPI Error:', fbError.response ? fbError.response.data : fbError.message);
      }

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, courierName, note } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (courierName !== undefined) order.courierName = courierName;

    // Build the log entry
    const logEntry = {
      status: order.status,
      date: new Date().toISOString(),
      note: note || `Order updated`,
      courierName: order.courierName,
      trackingNumber: order.trackingNumber
    };

    let currentLogs = [];
    if (Array.isArray(order.statusLogs)) {
      currentLogs = [...order.statusLogs];
    } else if (typeof order.statusLogs === 'string') {
      try { currentLogs = JSON.parse(order.statusLogs); } catch(e) { currentLogs = []; }
    }

    currentLogs.push(logEntry);
    order.statusLogs = currentLogs;

    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No order IDs provided' });
    }
    if (!status) {
      return res.status(400).json({ message: 'No status provided' });
    }

    const orders = await Order.findAll({ where: { id: ids } });
    
    for (const order of orders) {
      order.status = status;
      
      const logEntry = {
        status: status,
        date: new Date().toISOString(),
        note: `Bulk status update to ${status}`,
        courierName: order.courierName,
        trackingNumber: order.trackingNumber
      };

      let currentLogs = [];
      if (Array.isArray(order.statusLogs)) {
        currentLogs = [...order.statusLogs];
      } else if (typeof order.statusLogs === 'string') {
        try { currentLogs = JSON.parse(order.statusLogs); } catch(e) { currentLogs = []; }
      }

      currentLogs.push(logEntry);
      order.statusLogs = currentLogs;
      
      await order.save();
    }

    res.json({ message: 'Orders updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bulkDeleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No order IDs provided' });
    }

    // Only allow deleting cancelled orders
    const deleted = await Order.destroy({
      where: {
        id: ids,
        status: 'Cancelled'
      }
    });

    res.json({ message: `Successfully deleted ${deleted} cancelled orders` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus, getOrderById, bulkUpdateOrderStatus, bulkDeleteOrders };

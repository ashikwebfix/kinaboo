const axios = require('axios');
const Setting = require('../models/Setting');
const Order = require('../models/Order');

// Helper to get Pathao Credentials from DB
const getPathaoConfig = async () => {
  const setting = await Setting.findOne({ where: { key: 'pathao_settings' } });
  if (!setting || !setting.value || !setting.value.clientId) {
    throw new Error('Pathao API is not fully configured in Settings.');
  }
  return setting.value;
};

// Helper to generate access token
const getAccessToken = async (config) => {
  try {
    const response = await axios.post(`${config.baseUrl}/aladdin/api/v1/issue-token`, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      username: config.username,
      password: config.password,
      grant_type: 'password'
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Pathao Auth Error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Pathao API. Check credentials.');
  }
};

const getCities = async (req, res) => {
  try {
    const config = await getPathaoConfig();
    const token = await getAccessToken(config);
    const response = await axios.get(`${config.baseUrl}/aladdin/api/v1/countries/1/city-list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data.data.data || response.data.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getZones = async (req, res) => {
  try {
    const { city_id } = req.params;
    const config = await getPathaoConfig();
    const token = await getAccessToken(config);
    const response = await axios.get(`${config.baseUrl}/aladdin/api/v1/cities/${city_id}/zone-list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data.data.data || response.data.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAreas = async (req, res) => {
  try {
    const { zone_id } = req.params;
    const config = await getPathaoConfig();
    const token = await getAccessToken(config);
    const response = await axios.get(`${config.baseUrl}/aladdin/api/v1/zones/${zone_id}/area-list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data.data.data || response.data.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createConsignment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { city_id, zone_id, area_id, weight, item_type } = req.body; // item_type: 1=Document, 2=Parcel

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const config = await getPathaoConfig();
    const token = await getAccessToken(config);

    const payload = {
      store_id: config.storeId,
      merchant_order_id: order.id.slice(0, 8),
      recipient_name: order.name,
      recipient_phone: order.phone,
      recipient_address: order.shippingAddress,
      recipient_city: city_id,
      recipient_zone: zone_id,
      recipient_area: area_id,
      delivery_type: 48, // Standard delivery
      item_type: item_type || 2, // Default Parcel
      item_quantity: 1,
      item_weight: weight || 0.5,
      amount_to_collect: order.paymentMethod === 'Cash on Delivery' ? Number(order.totalPrice) : 0,
      item_description: `Order #${order.id.slice(0, 8)} items`
    };

    const response = await axios.post(`${config.baseUrl}/aladdin/api/v1/orders`, payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const consignmentId = response.data.data.consignment_id;

    // Update order with Pathao tracking
    order.trackingNumber = consignmentId;
    order.courierName = 'Pathao';
    
    // Add timeline log
    const logEntry = {
      status: order.status,
      date: new Date().toISOString(),
      note: `Dispatched via Pathao. Consignment ID: ${consignmentId}`,
      courierName: 'Pathao',
      trackingNumber: consignmentId
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

    res.json({ success: true, consignment_id: consignmentId, order });

  } catch (error) {
    console.error('Pathao Create Order Error:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
};

const getTracking = async (req, res) => {
  try {
    const { consignment_id } = req.params;
    const config = await getPathaoConfig();
    // Tracking might not need token depending on API, but we'll use it to be safe
    const token = await getAccessToken(config);
    // There are a few endpoints for tracking, assuming the standard one:
    // Sometimes it's /aladdin/api/v1/orders/{consignment_id}/tracking
    const response = await axios.get(`${config.baseUrl}/aladdin/api/v1/orders/${consignment_id}/tracking`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCities,
  getZones,
  getAreas,
  createConsignment,
  getTracking
};

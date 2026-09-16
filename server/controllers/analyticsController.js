const axios = require('axios');
const Visitor = require('../models/Visitor');
const PageView = require('../models/PageView');
const ClickEvent = require('../models/ClickEvent');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/db');

const initSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    let { userAgent } = req.body;
    
    // Ensure userAgent fits in VARCHAR(255) to prevent 500 Internal Server Errors
    if (userAgent && userAgent.length > 255) {
      userAgent = userAgent.substring(0, 255);
    }

    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // clean ipv6 localhost
    if (ipAddress === '::1') {
      ipAddress = '127.0.0.1';
    } else if (ipAddress && ipAddress.includes('::ffff:')) {
      ipAddress = ipAddress.split('::ffff:')[1];
    }

    let visitor = await Visitor.findOne({ where: { sessionId } });

    if (!visitor) {
      let geo = { country: 'Unknown', city: 'Unknown', lat: 0, lon: 0 };
      
      try {
        // If localhost, don't send the IP, ip-api will use the server's public IP
        const apiUrl = ipAddress === '127.0.0.1' ? 'http://ip-api.com/json/' : `http://ip-api.com/json/${ipAddress}`;
        const geoRes = await axios.get(apiUrl);
        if (geoRes.data.status === 'success') {
          geo = {
            country: geoRes.data.country,
            city: geoRes.data.city,
            lat: geoRes.data.lat,
            lon: geoRes.data.lon
          };
        }
      } catch (e) {
        console.error("GeoIP Error:", e.message);
      }

      visitor = await Visitor.create({
        sessionId,
        ipAddress,
        country: geo.country,
        city: geo.city,
        lat: geo.lat,
        lon: geo.lon,
        userAgent
      });
    } else {
      visitor.lastActive = new Date();
      await visitor.save();
    }

    res.json({ success: true, visitorId: visitor.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackPageview = async (req, res) => {
  try {
    const { sessionId, pageUrl, referrer } = req.body;
    let visitor = await Visitor.findOne({ where: { sessionId } });
    if (!visitor) {
      visitor = await Visitor.create({
        sessionId,
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
        userAgent: req.headers['user-agent'] || ''
      });
    }

    visitor.lastActive = new Date();
    await visitor.save();

    await PageView.create({
      visitorId: visitor.id,
      pageUrl,
      referrer
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackClicks = async (req, res) => {
  try {
    const { sessionId, pageUrl, clicks } = req.body;
    let visitor = await Visitor.findOne({ where: { sessionId } });
    if (!visitor) {
      visitor = await Visitor.create({
        sessionId,
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
        userAgent: req.headers['user-agent'] || ''
      });
    }

    visitor.lastActive = new Date();
    await visitor.save();

    const clickData = clicks.map(c => ({
      visitorId: visitor.id,
      pageUrl,
      x: c.x,
      y: c.y,
      screenWidth: c.w,
      screenHeight: c.h
    }));

    await ClickEvent.bulkCreate(clickData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    // Active users in last 5 minutes
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeVisitors = await Visitor.findAll({
      where: { lastActive: { [Op.gte]: fiveMinsAgo } }
    });

    // Top pages (today)
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const pageviews = await PageView.findAll({
      where: { timestamp: { [Op.gte]: startOfDay } }
    });

    // Clicks for heatmap
    const { heatmapUrl } = req.query;
    let clicks = [];
    if (heatmapUrl) {
      clicks = await ClickEvent.findAll({
        where: { pageUrl: heatmapUrl },
        order: [['timestamp', 'DESC']],
        limit: 5000 
      });
    }

    // 1. Max visited product
    const maxVisitedProductsData = await PageView.findAll({
      where: {
        pageUrl: { [Op.like]: '/product/%' }
      },
      attributes: [
        'pageUrl',
        [fn('COUNT', col('id')), 'visitCount']
      ],
      group: ['pageUrl'],
      order: [[literal('visitCount'), 'DESC']],
      limit: 10
    });

    // We need to fetch product details for these views
    const maxVisitedProducts = [];
    for (let mvp of maxVisitedProductsData) {
      const slug = mvp.pageUrl.replace('/product/', '');
      const product = await Product.findOne({ where: { slug }, attributes: ['name', 'image', 'price'] });
      if (product) {
        maxVisitedProducts.push({
          product,
          visitCount: mvp.dataValues.visitCount
        });
      }
    }

    // 2. Max selling product
    const maxSellingProductsData = await OrderItem.findAll({
      attributes: [
        'productId',
        [fn('SUM', col('qty')), 'totalSold']
      ],
      group: ['productId'],
      order: [[literal('totalSold'), 'DESC']],
      limit: 10,
      include: [
        { model: Product, as: 'product', attributes: ['name', 'image', 'price'] }
      ]
    });

    // 3. Trending by the day (last 7 days pageviews)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentPageViews = await PageView.findAll({
      where: { timestamp: { [Op.gte]: sevenDaysAgo } },
      attributes: ['timestamp']
    });

    const trendingByDay = {};
    recentPageViews.forEach(pv => {
      const dateStr = pv.timestamp.toISOString().split('T')[0];
      trendingByDay[dateStr] = (trendingByDay[dateStr] || 0) + 1;
    });
    
    // Sort trending by date
    const trendingData = Object.keys(trendingByDay).sort().map(date => ({
      date,
      views: trendingByDay[date]
    }));

    // 4. Visitors by location
    const visitorsByLocationData = await Visitor.findAll({
      attributes: [
        'country',
        'city',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['country', 'city'],
      order: [[literal('count'), 'DESC']]
    });

    res.json({
      activeVisitors,
      activeCount: activeVisitors.length,
      pageviews: pageviews.length,
      clicks,
      maxVisitedProducts,
      maxSellingProducts: maxSellingProductsData,
      trendingData,
      visitorsByLocation: visitorsByLocationData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Setting = require('../models/Setting'); // Need Setting to fetch tracking settings
const Category = require('../models/Category'); // Need Category to fetch category CAPI tokens

const sendCAPIEvent = async (req, res) => {
  try {
    const { eventName, eventData, eventId, eventSourceUrl, clientIp, userAgent, fbp, fbc, categoryNames } = req.body;
    
    // Fetch tracking settings
    const trackingSetting = await Setting.findOne({ where: { key: 'tracking_settings' } });
    if (!trackingSetting || !trackingSetting.value) {
      return res.status(200).json({ success: false, message: 'Tracking settings not configured' });
    }
    
    // Get array of pixels, falling back to legacy fields if array is empty
    let pixels = trackingSetting.value.fbPixels || [];
    if (pixels.length === 0 && trackingSetting.value.fbPixelId && trackingSetting.value.fbCapiToken) {
      pixels = [{
        pixelId: trackingSetting.value.fbPixelId,
        capiToken: trackingSetting.value.fbCapiToken,
        testEventCode: trackingSetting.value.fbTestEventCode
      }];
    }
    
    if (categoryNames && Array.isArray(categoryNames) && categoryNames.length > 0) {
      const categories = await Category.findAll({
        where: { title: categoryNames }
      });
      categories.forEach(cat => {
        if (cat.fbPixelId && cat.fbCapiToken) {
          if (!pixels.find(p => p.pixelId === cat.fbPixelId)) {
            pixels.push({
              pixelId: cat.fbPixelId,
              capiToken: cat.fbCapiToken,
              testEventCode: trackingSetting?.value?.fbTestEventCode || ''
            });
          }
        }
      });
    }

    if (pixels.length === 0) {
      return res.status(200).json({ success: false, message: 'Facebook CAPI not fully configured' });
    }

    // IP logic to avoid sending local IPs to Facebook (which causes API errors)
    let finalClientIp = clientIp || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (finalClientIp === '::1' || finalClientIp === '127.0.0.1') {
      finalClientIp = '1.1.1.1'; // FB requires a valid IP format, mock it for local dev
    }

    // Send CAPI to all pixels in parallel
    const promises = pixels.map(async (pixel) => {
      if (!pixel.pixelId || !pixel.capiToken) return { success: false, reason: 'Missing Pixel ID or Token' };
      
      const payload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: eventSourceUrl,
            action_source: 'website',
            user_data: {
              client_ip_address: finalClientIp,
              client_user_agent: userAgent || req.headers['user-agent'],
              ...(fbp && { fbp }),
              ...(fbc && { fbc })
            },
            custom_data: eventData
          }
        ]
      };

      if (pixel.testEventCode && pixel.testEventCode.trim() !== '') {
        payload.test_event_code = pixel.testEventCode.trim();
      }

      try {
        const response = await axios.post(`https://graph.facebook.com/v17.0/${pixel.pixelId}/events?access_token=${pixel.capiToken}`, payload);
        return { success: true, pixelId: pixel.pixelId, data: response.data };
      } catch (err) {
        return { success: false, pixelId: pixel.pixelId, error: err.response?.data || err.message };
      }
    });

    const results = await Promise.allSettled(promises);
    
    res.json({ success: true, results });
  } catch (error) {
    console.error('CAPI Error:', error.message);
    res.status(500).json({ message: 'Failed to send CAPI event', error: error.message });
  }
};

module.exports = {
  initSession,
  trackPageview,
  trackClicks,
  getDashboardStats,
  sendCAPIEvent
};

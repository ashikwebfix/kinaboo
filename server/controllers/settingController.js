const Setting = require('../models/Setting');

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Public
const getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ where: { key: req.params.key } });
    if (setting) {
      res.json(setting.value);
    } else {
      // Return default if not found
      if (req.params.key === 'delivery_methods') {
        res.json([
          { id: Date.now().toString(), name: 'Inside Dhaka', charge: 60 },
          { id: (Date.now() + 1).toString(), name: 'Outside Dhaka', charge: 120 }
        ]);
      } else if (req.params.key === 'header_menu') {
        res.json([
          { id: '1', label: 'Home', url: '/', icon: 'Home' },
          { id: '2', label: 'Shop', url: '/', icon: 'PackageSearch' },
          { id: '3', label: 'Categories', url: '/', icon: 'Layers' },
          { id: '4', label: 'Contact', url: '/', icon: 'Phone' }
        ]);
      } else if (req.params.key === 'tracking_settings') {
        res.json({
          gtmId: '',
          fbPixelId: '',
          fbCapiToken: ''
        });
      } else if (req.params.key === 'storefront_ui') {
        res.json({
          heroBanners: [
            { id: '1', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000', title: 'Summer Collection', subtitle: 'Up to 50% Off', link: '/shop' }
          ],
          superHourDeals: {
            productIds: [],
            endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
          },
          featuredProducts: {
            title: 'Featured Products',
            productIds: []
          },
          customSections: []
        });
      } else if (req.params.key === 'fraud_protection') {
        res.json({
          enableIPBlocking: false,
          enableUserAgentBlocking: false,
          blockedIPs: [],
          blockedUserAgents: [],
          maxOrdersPerIP: 5,
          timeWindowMinutes: 60
        });
      } else if (req.params.key === 'general_settings') {
        res.json({
          maintenanceMode: false,
          maintenanceMessage: 'Site is under maintenance. We will be right back.'
        });
      } else {
        res.status(404).json({ message: 'Setting not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update or create setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    let setting = await Setting.findOne({ where: { key } });

    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value });
    }

    res.json(setting.value);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getSettingByKey, updateSetting };

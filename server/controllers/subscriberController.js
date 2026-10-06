const Subscriber = require('../models/Subscriber');

// @desc    Add a new subscriber
// @route   POST /api/subscribers
// @access  Public
const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingSubscriber = await Subscriber.findOne({ where: { email: email.toLowerCase() } });
    
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email is already subscribed' });
    }

    const subscriber = await Subscriber.create({ email: email.toLowerCase() });

    res.status(201).json({ message: 'Successfully subscribed!', subscriber });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Admin
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.findAll({ order: [['createdAt', 'DESC']] });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a subscriber
// @route   DELETE /api/subscribers/:id
// @access  Admin
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByPk(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    await subscriber.destroy();
    res.json({ message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addSubscriber,
  getSubscribers,
  deleteSubscriber
};

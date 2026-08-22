const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'superadmin' || req.user.role === 'admin' || req.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (req.user && (roles.includes(req.user.role) || (roles.includes('admin') && req.user.isAdmin))) {
      next();
    } else {
      res.status(403).json({ message: `Not authorized. Requires one of: ${roles.join(', ')}` });
    }
  };
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    } catch (error) {
      // ignore
    }
  }
  next();
};

module.exports = { protect, admin, requireRole, optionalAuth };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const getUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
};

const getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    
    await user.save();
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'customer',
    isAdmin: ['admin', 'superadmin'].includes(role)
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
};

const deleteUser = async (req, res) => {
  const userToDelete = await User.findByPk(req.params.id);
  if (!userToDelete) return res.status(404).json({ message: 'User not found' });
  
  if (userToDelete.role === 'superadmin') {
    return res.status(403).json({ message: 'Cannot delete superadmin' });
  }
  if (req.user.role === 'admin' && userToDelete.role === 'admin') {
    return res.status(403).json({ message: 'Admin cannot delete another admin' });
  }
  
  await userToDelete.destroy();
  res.json({ message: 'User removed' });
};

const updateUserRole = async (req, res) => {
  const userToUpdate = await User.findByPk(req.params.id);
  if (!userToUpdate) return res.status(404).json({ message: 'User not found' });
  
  if (userToUpdate.role === 'superadmin' && req.body.role !== 'superadmin') {
    return res.status(403).json({ message: 'Cannot demote superadmin' });
  }
  if (req.user.role === 'admin' && (userToUpdate.role === 'admin' || userToUpdate.role === 'superadmin')) {
    return res.status(403).json({ message: 'Admin cannot modify role of admin or superadmin' });
  }
  
  userToUpdate.role = req.body.role;
  userToUpdate.isAdmin = ['admin', 'superadmin'].includes(req.body.role);
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    userToUpdate.password = await bcrypt.hash(req.body.password, salt);
  }
  await userToUpdate.save();
  res.json({ id: userToUpdate.id, name: userToUpdate.name, email: userToUpdate.email, role: userToUpdate.role });
};

module.exports = { authUser, registerUser, getUsers, getUserProfile, updateUserProfile, createUser, deleteUser, updateUserRole };

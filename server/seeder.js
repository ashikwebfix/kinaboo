const { sequelize } = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Category = require('./models/Category');
const { categories, products } = require('./demoData');
const bcrypt = require('bcryptjs');

const importData = async () => {
  try {
    console.log('Starting seeder...');
    await sequelize.sync({ force: true }); // Wipe DB and recreate tables
    console.log('Database Synced!');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    console.log('Inserting Users...');
    await User.bulkCreate([
      { name: 'Admin User', email: 'admin@site.com', password, role: 'superadmin', isAdmin: true },
      { name: 'John Doe', email: 'john@site.com', password, role: 'customer', isAdmin: false }
    ]);
    
    console.log('Inserting Categories...');
    await Category.bulkCreate(categories);
    console.log('Inserting Products...');
    await Product.bulkCreate(products);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error('SEEDER ERROR:', error);
    process.exit(1);
  }
};

importData();

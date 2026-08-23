const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce', 
  process.env.DB_USER || 'root', 
  process.env.DB_PASS || 'mysql', 
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: console.log,
  }
);

// Import models
require('./models/User');
require('./models/Product');
require('./models/Order');
require('./models/OrderItem');
require('./models/Category');
require('./models/DeliveryMethod');
require('./models/DiscountBanner');
require('./models/VolumeBundle');
require('./models/Page');
// Setup associations
require('./models/associations');

const syncDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection successful.');
    
    console.log('Syncing database (alter: true) to add missing columns...');
    // This will safely add the new "configurator" column without deleting data
    await sequelize.sync({ alter: true });
    
    console.log('Database synced successfully! The 500 error should now be fixed.');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();

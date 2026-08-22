const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce', 
  process.env.DB_USER || 'root', 
  process.env.DB_PASS || 'mysql', 
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connected Successfully!');
    await sequelize.sync();
    console.log('Database synced without alter');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
};

module.exports = { sequelize, connectDB };

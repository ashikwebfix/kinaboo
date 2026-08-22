const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  }
);

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Manually add the volumeBundles column if it doesn't exist
    try {
      await sequelize.query('ALTER TABLE Products ADD COLUMN volumeBundles JSON;');
      console.log('Successfully added volumeBundles column to Products table.');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('Column volumeBundles already exists, skipping.');
      } else {
        throw err;
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

run();

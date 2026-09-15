const { sequelize } = require('./server/config/db');

async function addCols() {
  try {
    await sequelize.query('ALTER TABLE `AbandonedCarts` ADD COLUMN `ipAddress` VARCHAR(255) NULL;');
    await sequelize.query('ALTER TABLE `AbandonedCarts` ADD COLUMN `userAgent` VARCHAR(255) NULL;');
    await sequelize.query('ALTER TABLE `AbandonedCarts` ADD COLUMN `fbp` VARCHAR(255) NULL;');
    await sequelize.query('ALTER TABLE `AbandonedCarts` ADD COLUMN `fbc` VARCHAR(255) NULL;');
    console.log('Columns added successfully');
  } catch (e) {
    console.error(e.message);
  }
  process.exit(0);
}
addCols();

const { sequelize } = require('./server/config/db');

async function check() {
  try {
    const [cols] = await sequelize.query('SHOW COLUMNS FROM `AbandonedCarts`');
    console.log(cols.map(c => c.Field));
  } catch (e) {
    console.error(e.message);
  }
  process.exit(0);
}
check();

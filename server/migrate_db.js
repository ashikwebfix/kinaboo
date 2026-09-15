const { sequelize } = require('./config/db');
require('./models/User');
require('./models/AbandonedCart');
require('./models/Order');

sequelize.authenticate().then(async () => {
  console.log('Connected to DB. Running sync with alter...');
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully! All columns added.');
  } catch (err) {
    console.error('Error syncing DB:', err);
  }
  process.exit(0);
}).catch(e => { 
  console.error('Failed to connect:', e.message); 
  process.exit(1); 
});

require('dotenv').config();
const { sequelize } = require('./config/db');
const User = require('./models/User');

const migrate = async () => {
  try {
    // Ensure table matches model (adds role column)
    await sequelize.sync({ alter: true });
    
    const count = await User.update(
      { role: 'superadmin' },
      { where: { isAdmin: true } }
    );
    console.log(`Migration complete. Updated ${count[0]} admins to superadmin.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed', error);
    process.exit(1);
  }
};

migrate();

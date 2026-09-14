const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

const Setting = sequelize.define('Setting', {
  key: { type: DataTypes.STRING, allowNull: false, unique: true },
  value: { type: DataTypes.JSON, allowNull: false }
});

(async () => {
  try {
    const setting = await Setting.findOne({ where: { key: 'pathao_settings' } });
    console.log(JSON.stringify(setting?.value, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();

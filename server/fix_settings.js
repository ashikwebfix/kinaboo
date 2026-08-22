const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const Setting = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.JSON,
    allowNull: false,
  }
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  }
});

async function fix() {
  await sequelize.authenticate();
  const products = await Product.findAll({ limit: 4 });
  const productIds = products.map(p => p.id);

  let setting = await Setting.findOne({ where: { key: 'storefront_ui' } });
  if (setting) {
    const val = setting.value;
    val.superHourDeals.productIds = productIds;
    val.featuredProducts.productIds = productIds;
    setting.value = val;
    await setting.save();
    console.log('Fixed storefront_ui with IDs:', productIds);
  }
  process.exit();
}
fix();

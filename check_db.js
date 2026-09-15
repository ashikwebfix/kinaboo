const { sequelize } = require('./server/config/db');
async function check() {
  const [results] = await sequelize.query("SELECT TABLE_NAME, index_name, count(*) as c FROM information_schema.statistics WHERE table_schema = 'ecommerce' GROUP BY TABLE_NAME, index_name");
  console.log(results);
}
check();

const { sequelize } = require('./server/config/db');

async function cleanup() {
  const [tables] = await sequelize.query('SHOW TABLES');
  for (let t of tables) {
    const tableName = Object.values(t)[0];
    const [indexes] = await sequelize.query(`SHOW INDEXES FROM \`${tableName}\``);
    const indexNames = [...new Set(indexes.map(i => i.Key_name))];
    
    for (let idx of indexNames) {
      if (idx !== 'PRIMARY' && /_[0-9]+$/.test(idx)) {
        try {
          await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${idx}\``);
          console.log(`Dropped index ${idx} from ${tableName}`);
        } catch (e) {
          console.error(`Failed to drop index ${idx} from ${tableName}:`, e.message);
        }
      }
    }
  }
  console.log('Done cleaning up indexes');
  process.exit(0);
}
cleanup();

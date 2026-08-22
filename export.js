const { sequelize } = require('./server/config/db');
const User = require('./server/models/User');
const Product = require('./server/models/Product');
const Category = require('./server/models/Category');
const fs = require('fs');

async function exportSQL() {
  try {
    await sequelize.authenticate();
    let sql = 'SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSET time_zone = "+00:00";\n\n';

    const models = [
      { model: User, table: 'Users' },
      { model: Category, table: 'Categories' },
      { model: Product, table: 'Products' }
    ];

    for (const { model, table } of models) {
      const records = await model.findAll({ raw: true });
      if (records.length === 0) continue;

      const fields = Object.keys(records[0]);
      sql += `INSERT INTO \`${table}\` (\`${fields.join('`, `')}\`) VALUES \n`;
      
      const values = records.map(record => {
        const rowVals = fields.map(field => {
          let val = record[field];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number') return val;
          if (typeof val === 'boolean') return val ? 1 : 0;
          if (typeof val === 'object') {
            // Sequelize might have already parsed JSON or returned a Date object
            if (val instanceof Date) {
              val = val.toISOString().slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS
            } else {
              val = JSON.stringify(val);
            }
          }
          val = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
          return `'${val}'`;
        });
        return `(${rowVals.join(', ')})`;
      });

      sql += values.join(',\n') + ';\n\n';
    }

    fs.writeFileSync('server/demo_data.sql', sql);
    console.log('Exported server/demo_data.sql successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
exportSQL();

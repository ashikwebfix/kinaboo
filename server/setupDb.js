const mysql = require('mysql2/promise');

async function initialize() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'mysql',
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`ecommerce\`;`);
    console.log('Database `ecommerce` created or already exists.');
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error.message);
  }
}

initialize();

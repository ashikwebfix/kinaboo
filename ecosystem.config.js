module.exports = {
  apps: [
    {
      name: 'kinaboo-backend',
      script: 'server.js',
      cwd: './server',
      env_production: {
        NODE_ENV: 'production',
        PORT: 6710,
        DB_HOST: 'localhost',
        DB_USER: 'root',
        DB_PASS: 'ashik@khan',
        DB_NAME: 'kinaboo',
        SITE_URL: 'https://kinaboo.com'
      },
    },
    {
      name: 'kinaboo-frontend',
      script: 'npm',
      args: 'run start',
      cwd: './frontend',
      env_production: {
        NODE_ENV: 'production',
        PORT: 6711
      },
    }
  ],
};

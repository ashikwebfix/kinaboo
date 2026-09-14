const axios = require('axios');
const Setting = require('./server/models/Setting');
require('dotenv').config({ path: './server/.env' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

(async () => {
  try {
    const config = {
      clientId: 'dummy',
      clientSecret: 'dummy',
      baseUrl: 'https://api-hermes.pathao.com' // or test?
    };
    const authPayload = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'client_credentials'
    };
    console.log(authPayload);
    const res = await axios.post(`${config.baseUrl}/aladdin/api/v1/issue-token`, authPayload);
    console.log(res.data);
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
})();

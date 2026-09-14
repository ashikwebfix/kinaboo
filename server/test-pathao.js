const axios = require('axios');

(async () => {
  try {
    const config = {
      clientId: 'dummy',
      clientSecret: 'dummy',
      baseUrl: 'https://api-hermes.pathao.com'
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

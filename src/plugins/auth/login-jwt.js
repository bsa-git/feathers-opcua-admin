const logger = require('../../logger');
module.exports = async function (appClient, accessToken) {
  try {
    if(!appClient) return;
    return await appClient.authenticate({
      strategy: 'jwt',
      accessToken,
    });
  } catch(err) {
    logger.error(`Error login jwt: ${err.message}`);
    return null;
  }
};

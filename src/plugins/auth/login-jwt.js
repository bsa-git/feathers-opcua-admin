
module.exports = async function (appClient, accessToken) {
  try {
    if(!appClient) return;
    return await appClient.authenticate({
      strategy: 'jwt',
      accessToken,
    });
  } catch(err) {
    throw err;
  }
};

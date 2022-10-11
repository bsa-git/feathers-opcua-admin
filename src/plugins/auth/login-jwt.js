
module.exports = async function (appClient, accessToken) {
  try {
    if(!appClient) return;
    await appClient.authenticate({
      strategy: 'jwt',
      accessToken,
    });
  } catch(err) {
    throw err;
  }
};


module.exports = async function (appClient, email, password) {
  try {
    if(!appClient) return;
    return await appClient.authenticate({
      strategy: 'local',
      email,
      password,
    });
  } catch(err) {
    throw err;
  }
};

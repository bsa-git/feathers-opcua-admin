/* eslint-disable no-unused-vars */
const assert = require('assert');
const rp = require('request-promise');
const url = require('url');
const app = require('../../src/app');
const chalk = require('chalk');

const isDebug = false;

const {
  logger,
  inspector,
  localStorage,
  loginLocal,
  loginJwt,
  makeClient,
  getIdField,
  checkServicesRegistered,
  saveFakesToServices,
  getFakeData
} = require('../../src/plugins');

const port = app.get('port') || 3030;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

// Get user data
const usersFakeData = getFakeData()['users'];
const userFakeData = usersFakeData[0];
const userEmail = userFakeData.email;
const userPass = userFakeData.password;
const idField = getIdField(userFakeData);
const userId = userFakeData[idField].toString();

describe(`<<<=== Test "${__filename.substring(__dirname.length + 1)}" ===>>>`, () => {
  let server, appRestClient, appSocketioClient, accessToken;
  //---------------------
  before(function (done) {
    server = app.listen(port);
    server.once('listening', () => {
      setTimeout(async () => {
        try {
          localStorage.clear();

          if (checkServicesRegistered(app, 'users')) new Error('Error - checkServicesRegistered("users")');
          const errPath = await saveFakesToServices(app, 'users');
          if (errPath) new Error('Error - saveFakesToServices("users")');
          if (!errPath) logger.info(chalk.yellow('saveFakesToServices("users") - OK'));

          // Create appClient for transports: 'socketio', 'rest'
          appRestClient = await makeClient({ transport: 'rest', serverUrl: process.env.BASE_URL });
          appSocketioClient = await makeClient({ transport: 'socketio', serverUrl: process.env.BASE_URL });
          done();
        } catch (error) {
          logger.error(error.message);
          done();
        }
      }, 500);
    });
  });

  after(function (done) {
    server.close();
    setTimeout(() => { done(); }, 500);
  });

  it('#1: loginLocal for user and logout', async () => {
    let result = await loginLocal(appRestClient, userEmail, userPass);
    if (result.accessToken) {
      accessToken = result.accessToken;
      logger.info(chalk.yellow(`loginLocal for email: "${userEmail}", password: "${userPass}" - OK`));
      logger.info(chalk.yellow(`loginLocal for accessToken: "${accessToken}" - OK`));
    }
    assert.ok(accessToken, 'loginLocal for user and logout');
    let service = appRestClient.service('users');
    let user = await service.get(userId);
    if(isDebug && user) inspector(`appRestClient.get("${userId}"):`, user);
    assert.ok(user[idField].toString() === userId, 'loginLocal for user and logout');
    // appRestClient logout()
    await appRestClient.logout();
    try {
      service = appRestClient.service('users');
      user = await service.get(userId);
      assert.ok(false, 'loginLocal for user and logout');
    } catch (error) {
      assert.ok(true, 'loginLocal for user and logout');
    }
  });

  it('#2: loginJwt for accessToken and logout', async () => {
    let result = await loginLocal(appRestClient, userEmail, userPass);
    if (result.accessToken) {
      accessToken = result.accessToken;
    }
    result = await loginJwt(appSocketioClient, accessToken);
    if (result.accessToken) {
      accessToken = result.accessToken;
      logger.info(chalk.yellow(`loginJwt for accessToken: "${accessToken}" - OK`));
    }
    assert.ok(accessToken, 'loginJwt for accessToken and logout');
    let service = appSocketioClient.service('users');
    let user = await service.get(userId);
    if(isDebug && user) inspector(`appSocketioClient.get("${userId}"):`, user);
    assert.ok(user[idField].toString() === userId, 'loginJwt for accessToken and logout');
    await appSocketioClient.logout();
    try {
      service = appSocketioClient.service('users');
      user = await service.get(userId);
      assert.ok(false, 'loginJwt for accessToken and logout');
    } catch (error) {
      assert.ok(true, 'loginJwt for accessToken and logout');
    }
  });
});

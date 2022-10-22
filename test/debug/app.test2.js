/* eslint-disable no-unused-vars */
const assert = require('assert');
const URL = require('url').URL;
const app = require('../../src/app');
const port = app.get('port') || 3131;
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
  getFakeData,
  AuthServer
} = require('../../src/plugins');

/**
 * Get URL
 * @method getURL
 * @param {String} pathname 
 * @returns {String}
 */
const getURL = (pathname = '') => {
  const port = app.get('port') || 3131;
  const host = app.get('host') || 'localhost';
  let url = new URL(pathname, `http://${host}:${port}`);
  url = url.href;
  return url;
};

// Get user data
const usersFakeData = getFakeData()['users'];
const firstUser = usersFakeData[0];
const userEmail = firstUser.email;
const userPass = firstUser.password;
const idField = getIdField(firstUser);
const userId = firstUser[idField].toString();

describe(`<<<=== Test "${__filename.substring(__dirname.length + 1)}" ===>>>`, () => {
  let server, appRestClient, appSocketioClient, accessToken;
  //------------------------------------------------------------
  const serverUrl = getURL();
  
  describe('<--- Test of feathers client for transport ("socketio") --->', () => {
    before(function (done) {
      server = app.listen(port);
      server.once('listening', () => {
        setTimeout(async () => {
          try {
            localStorage.clear();
  
            // Create appClient for transports: 'socketio'
            appSocketioClient = await makeClient({ transport: 'socketio', serverUrl });
            // Create user
            let service = app.service('users');
            await service.remove(null);
            service = appSocketioClient.service('users');
            const user = await service.create(firstUser);
            if(true && user) logger.info(chalk.yellow('appSocketioClient.create user - OK'));
  
            // Login local for userEmail, userPass
            let result = await loginLocal(appSocketioClient, userEmail, userPass);
            if(true && result && result.accessToken) {
              accessToken = result.accessToken;
              logger.info(chalk.yellow('appSocketioClient loginLocal - OK'));
            } 
            if (isDebug && result && result.accessToken) {
              inspector('appSocketioClient.passwort.getJWT:', await AuthServer.getPassportJWT(appSocketioClient));
              inspector('appSocketioClient.passwort.verifyJWT:', await AuthServer.verifyPassportJWT(appSocketioClient, accessToken));
            }
  
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

    it('#1.1: Test - Is appSocketioClient authentication accessToken', async () => {
      assert.ok(accessToken, 'Authentication accessToken');
    });

    it('#2.1: Test - appSocketioClient create newUsers', async () => {
      let service = appSocketioClient.service('users');
      let newUsers = usersFakeData.filter(usr => usr[idField] !== userId);
      newUsers = await service.create(newUsers);
      if (true && newUsers.length) logger.info(chalk.yellow(`appSocketioClient created (${newUsers.length}) newUsers - OK`));
      assert.ok(newUsers.length, 'appSocketioClient don\'t created newUsers');
    });

    it('#3.1: Test - appSocketioClient get firstUser', async () => {
      let service = appSocketioClient.service('users');
      const firstUser = await service.get(userId);
      if (true && firstUser) logger.info(chalk.yellow(`appSocketioClient get firstUser for id: ("${firstUser[idField]}") - OK`));
      assert.ok(firstUser[idField] === userId, 'appSocketioClient don\'t get firstUser');
    });

    it('#4.1: Test - appSocketioClient patch firstUser', async () => {
      let service = appSocketioClient.service('users');
      const firstUser = await service.patch(userId, { lastName: 'Sporer2' });
      if (true && firstUser) logger.info(chalk.yellow(`appSocketioClient patch firstUser for lastName: "${firstUser['lastName']}" - OK`));
      assert.ok(firstUser['lastName'] === 'Sporer2', 'appSocketioClient don\'t patch firstUser');
    });

    it('#5.1: Test - appSocketioClient find allUsers', async () => {
      let service = appSocketioClient.service('users');
      let allUsers = await service.find({ query: {} });
      allUsers = allUsers.data;
      if (true && allUsers.length) logger.info(chalk.yellow(`appSocketioClient find (${allUsers.length}) allUsers - OK`));
      assert.ok(allUsers.length === usersFakeData.length, 'appSocketioClient don\'t find allUsers');
    });
  
    it('#6.1: loginJwt for accessToken and logout', async () => {
      let service = appSocketioClient.service('users');
      let user = await service.get(userId);
      if (isDebug && user) inspector(`appSocketioClient.get("${userId}"):`, user);
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

  describe('<--- Test of feathers client for transport ("rest") --->', () => {
    before(function (done) {
      server = app.listen(port);
      server.once('listening', () => {
        setTimeout(async () => {
          try {
            localStorage.clear();
  
            // Create appClient for transports: 'rest'
            appRestClient = await makeClient({ transport: 'rest', serverUrl });
  
            let service = app.service('users');
            await service.remove(null);
            service = appRestClient.service('users');
            const user = await service.create(firstUser);
            if(true && user) logger.info(chalk.yellow('appRestClient.create user - OK'));
  
            // Login local for userEmail, userPass
            let result = await loginLocal(appRestClient, userEmail, userPass);
            if(true && result && result.accessToken) {
              accessToken = result.accessToken;
              logger.info(chalk.yellow('appRestClient loginLocal - OK'));
            } 
            if (isDebug && result && result.accessToken) {
              inspector('appSocketioClient.passwort.getJWT:', await AuthServer.getPassportJWT(appRestClient));
              inspector('appSocketioClient.passwort.verifyJWT:', await AuthServer.verifyPassportJWT(appRestClient, accessToken));
            }
  
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

    it('#1.2: Test - Is appRestClient authentication accessToken', async () => {
      assert.ok(accessToken, 'Authentication accessToken');
    });

    it('#2.2: Test - appRestClient create newUsers', async () => {
      let service = appRestClient.service('users');
      let newUsers = usersFakeData.filter(usr => usr[idField] !== userId);
      newUsers = await service.create(newUsers);
      if (true && newUsers.length) logger.info(chalk.yellow(`appSocketioClient created (${newUsers.length}) newUsers - OK`));
      assert.ok(newUsers.length, 'appSocketioClient don\'t created newUsers');
    });

    it('#3.2: Test - appRestClient get firstUser', async () => {
      let service = appRestClient.service('users');
      const firstUser = await service.get(userId);
      if (true && firstUser) logger.info(chalk.yellow(`appSocketioClient get firstUser for id: ("${firstUser[idField]}") - OK`));
      assert.ok(firstUser[idField] === userId, 'appSocketioClient don\'t get firstUser');
    });

    it('#4.2: Test - appRestClient patch firstUser', async () => {
      let service = appRestClient.service('users');
      const firstUser = await service.patch(userId, { lastName: 'Sporer2' });
      if (true && firstUser) logger.info(chalk.yellow(`appRestClient patch firstUser for lastName: "${firstUser['lastName']}" - OK`));
      assert.ok(firstUser['lastName'] === 'Sporer2', 'appRestClient don\'t patch firstUser');
    });

    it('#5.2: Test - appRestClient find allUsers', async () => {
      let service = appRestClient.service('users');
      let allUsers = await service.find({ query: {} });
      allUsers = allUsers.data;
      if (true && allUsers.length) logger.info(chalk.yellow(`appRestClient find (${allUsers.length}) allUsers - OK`));
      assert.ok(allUsers.length === usersFakeData.length, 'appRestClient don\'t find allUsers');
    });
  
    it('#6.2: loginJwt for accessToken and logout', async () => {
      let service = appRestClient.service('users');
      let user = await service.get(userId);
      if (isDebug && user) inspector(`appRestClient.get("${userId}"):`, user);
      assert.ok(user[idField].toString() === userId, 'loginJwt for accessToken and logout');
      await appRestClient.logout();
      try {
        service = appRestClient.service('users');
        user = await service.get(userId);
        assert.ok(false, 'loginJwt for accessToken and logout');
      } catch (error) {
        assert.ok(true, 'loginJwt for accessToken and logout');
      }
    });
  });
});

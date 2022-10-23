/* eslint-disable no-unused-vars */
const assert = require('assert');
const { join } = require('path');
// const app = require('../../src/app');
// const port = app.get('port') || 3131;
const chalk = require('chalk');
const loReverse = require('lodash/reverse');

const debug = require('debug')('app:authentication.test');
const isDebug = false;

const {
  appRoot,
  logger,
  inspector,
  getURL,
  localStorage,
  loginLocal,
  loginJwt,
  makeClient,
  getIdField,
  getFakeData,
  AuthServer
} = require('../../src/plugins');

const specsPath = join(appRoot, 'feathers-gen-specs.json');
const genSpecs = require(specsPath);
const transports = loReverse(genSpecs['app']['providers']);
const defaultJson = require(`${appRoot}/config/default.json`);
const configClient = (defaultJson.tests || {}).client;
const ioOptions = configClient.ioOptions || {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false,
  extraHeaders: {},
};
const primusOptions = configClient.primusOptions || { transformer: 'ws' };

// Get user data
const usersFakeData = getFakeData()['users'];
const firstUser = usersFakeData[0];
const userEmail = firstUser.email;
const userPass = firstUser.password;
const idField = getIdField(firstUser);
const userId = firstUser[idField].toString();

describe(`<<<=== Test "${__filename.substring(__dirname.length + 1)}" ===>>>`, () => {
  let app, server, appClient, accessToken;
  //------------------------------------------------------------
  
  transports.forEach((transport, index) => {

    describe(`<--- Test of feathers client for transport ("${transport}") --->`, () => {
      before(function (done) {
        localStorage.clear();

        // Restarting app.*s is required if the last mocha test did REST calls on its server.
        delete require.cache[require.resolve(`${appRoot}/${genSpecs.app.src}/app`)];
        app = require(`${appRoot}/${genSpecs.app.src}/app`);
        // Get PORT
        const port = !configClient.port ? 3131 : (configClient.port === 'PORT') ? process.env.PORT : configClient.port;
        if (isDebug) debug('port:', port);
        // Get serverUrl 
        const serverUrl = !configClient.restOptions ? 'http://localhost:3131' : (configClient.restOptions.url === 'BASE_URL') ? process.env.BASE_URL : configClient.restOptions.url;
        if (isDebug) debug('serverUrl:', serverUrl);

        server = app.listen(port);
        server.once('listening', () => {
          setTimeout(async () => {
            try {


              // Create appClient for transports: 'socketio', 'rest'
              appClient = await makeClient({ transport, serverUrl, ioOptions, primusOptions });
              // Create user
              let service = app.service('users');
              await service.remove(null);
              service = appClient.service('users');
              const user = await service.create(firstUser);
              if (true && user) logger.info(chalk.yellow(`${transport} appClient.create user - OK`));

              // Login local for userEmail, userPass
              let result = await loginLocal(appClient, userEmail, userPass);
              if (true && result && result.accessToken) {
                accessToken = result.accessToken;
                logger.info(chalk.yellow(`${transport} appClient loginLocal - OK`));
              }
              if (isDebug && result && result.accessToken) {
                inspector(`${transport} appClient.passwort.getJWT:`, await AuthServer.getPassportJWT(appClient));
                inspector(`${transport} appClient.passwort.verifyJWT:`, await AuthServer.verifyPassportJWT(appClient, accessToken));
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
        setTimeout(async () => {
          const isLogin = await AuthServer.isLoginJWT(appClient);
          if (isLogin) await appClient.logout();
          done();
        }, 500);
      });

      it(`#1.${index + 1}: Test - Is ${transport} appClient authentication accessToken`, async () => {
        assert.ok(accessToken, 'Authentication accessToken');
      });

      it(`#2.${index + 1}: Test - ${transport} appClient create newUsers`, async () => {
        let service = appClient.service('users');
        let newUsers = usersFakeData.filter(usr => usr[idField] !== userId);
        newUsers = await service.create(newUsers);
        if (true && newUsers.length) logger.info(chalk.yellow(`${transport} appClient created (${newUsers.length}) newUsers - OK`));
        assert.ok(newUsers.length, `${transport} appClient don't created newUsers`);
      });

      it(`#3.${index + 1}: Test - ${transport} appClient get firstUser`, async () => {
        let service = appClient.service('users');
        const firstUser = await service.get(userId);
        if (true && firstUser) logger.info(chalk.yellow(`${transport} appClient get firstUser for id: ("${firstUser[idField]}") - OK`));
        assert.ok(firstUser[idField] === userId, `${transport} appClient don't get firstUser`);
      });

      it(`#4.${index + 1}: Test - ${transport} appClient patch firstUser`, async () => {
        let service = appClient.service('users');
        const firstUser = await service.patch(userId, { lastName: 'Sporer2' });
        if (true && firstUser) logger.info(chalk.yellow(`${transport} appClient patch firstUser for lastName: "${firstUser['lastName']}" - OK`));
        assert.ok(firstUser['lastName'] === 'Sporer2', `${transport} appClient don't patch firstUser`);
      });

      it(`#5.${index + 1}: Test - ${transport} appClient find allUsers`, async () => {
        let service = appClient.service('users');
        let allUsers = await service.find({ query: {} });
        allUsers = allUsers.data;
        if (true && allUsers.length) logger.info(chalk.yellow(`${transport} appClient find (${allUsers.length}) allUsers - OK`));
        assert.ok(allUsers.length === usersFakeData.length, `${transport} appClient don't find allUsers`);
      });

      it(`#6.${index + 1}: Test - ${transport} appClient remove lastUser`, async () => {
        let service = appClient.service('users');
        const lastUser = usersFakeData[usersFakeData.length - 1];
        const removedLastUser = await service.remove(lastUser[idField]);
        if (true && removedLastUser) logger.info(chalk.yellow(`${transport} appClient remove lastUser for id: ("${removedLastUser[idField]}") - OK`));
        assert.ok(removedLastUser.email === lastUser.email, `${transport} appClient don't remove lastUser`);
      });

      it(`#7.${index + 1}: Test error for ${transport} appClient logout`, async () => {
        await appClient.logout();
        const isLogin = await AuthServer.isLoginJWT(appClient);
        if (true && !isLogin) logger.info(chalk.yellow(`${transport} appClient logout - OK`));
        assert.ok(!isLogin, `${transport} appClient don't logout`);
        try {
          const service = appClient.service('users');
          await service.get(userId);
          assert.ok(false, `There must  be an error when ${transport} appClient logout`);
        } catch (error) {
          assert.ok(true, `Not error when ${transport} appClient logout`);
        }
      });

      it(`#8.${index + 1}: Test - ${transport} appClient loginJwt`, async () => {
        let result = await loginJwt(appClient, accessToken);
        if (true && result && result.accessToken) {
          accessToken = result.accessToken;
          logger.info(chalk.yellow(`${transport} appClient loginJwt - OK`));
        }
        let service = appClient.service('users');
        const firstUser = await service.get(userId);
        if (true && firstUser) logger.info(chalk.yellow(`${transport} appClient get firstUser for id: ("${firstUser[idField]}") - OK`));
        assert.ok(firstUser[idField] === userId, `${transport} appClient don't get firstUser`);
      });

    });
  });
});

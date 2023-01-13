/* eslint-disable no-unused-vars */
const assert = require('assert');
const { join } = require('path');

const chalk = require('chalk');
const loReverse = require('lodash/reverse');

const debug = require('debug')('app:authentication.test');
const isDebug = false;
const isTest = true;

const {
  appRoot,
  logger,
  inspector,
  localStorage,
  loginLocal,
  loginJwt,
  makeClient,
  getIdField,
  getFakeData,
  AuthServer,
  clearCacheApp
} = require('../../src/plugins');

const specsPath = join(appRoot, 'feathers-gen-specs.json');
const genSpecs = require(specsPath);
let transports = genSpecs['app']['providers'];
// transports = transports.filter(tr => tr === 'rest');// socketio, rest
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
const userId = firstUser[idField];

const newUser = {
  email: 'new-user@test.com',
  password: 'new-user',
  isVerified: true
};

describe(`<<<=== Test "${__filename.substring(__dirname.length + 1)}" ===>>>`, () => {
  let app, server, appClient, myAccessToken, userId;
  //------------------------------------------------------------

  if (!isTest) { it('Not Test', () => { assert.ok(!isTest, '<--- Not Test --->'); }); return; }

  transports.forEach((transport, index) => {

    describe(`<--- Test of feathers client for transport ("${transport}") --->`, () => {
      before(function (done) {
        localStorage.clear();

        // Clear cache app
        app = clearCacheApp();

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
              // Remove all users
              let service = app.service('users');
              await service.remove(null);

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

      it(`#1.${index + 1}: Test - For "${transport}" appClient create newUser`, async () => {
        try {
          service = appClient.service('users');
          const user = await service.create(newUser);
          if (true && user) logger.info(chalk.yellow(`"${transport}" appClient.create user - OK`));
          if (isDebug && user) inspector('service.create(newUser):', user);
          assert.ok(user, 'New use not created.');
        } catch (error) {
          await appClient.logout();
          if (true && user) logger.info(chalk.yellow(`"${transport}" New user already exists!`));
        }

      });

      it(`#2.${index + 1}: Test - For "${transport}" appClient login to newUser`, async () => {
        try {
          // Login local for newUser.email, newUser.password
          let { accessToken } = await loginLocal(appClient, newUser.email, newUser.password);
          assert.ok(accessToken, 'Authentication accessToken');
          myAccessToken = accessToken;
          const payload = await AuthServer.verifyJWT(accessToken);
          if (isDebug && payload) inspector('AuthServer.verifyJWT.payload:', payload);
          userId = payload.userId ? payload.userId : payload.sub;
          if (isDebug && userId) inspector('newUser.userId:', userId);
          if (isDebug && accessToken) {
            inspector(`"${transport}" appClient.passwort.getJWT:`, await AuthServer.getPassportJWT(appClient));
            inspector(`"${transport}" appClient.passwort.verifyJWT:`, await AuthServer.verifyPassportJWT(appClient, accessToken));
          }
          logger.info(chalk.yellow(`"${transport}" appClient loginLocal - OK`));
        } catch (error) {
          if (true && error) logger.error(`Error for "${transport}" appClient login to newUser. Error.message: "${error.message}"`);
          assert.ok(false, `Error for "${transport}" appClient login to newUser.`);
        }
      });


      it(`#3.${index + 1}: Test - For "${transport}" appClient get newUser`, async () => {
        if(!myAccessToken) return;
        const service = appClient.service('users');
        const user = await service.get(userId);
        if (true && user) logger.info(chalk.yellow(`"${transport}" appClient get newUser for id: ("${user[idField]}") - OK`));
        assert.ok(user[idField] === userId, `"${transport}" appClient dosn't get newUser`);
      });

      it(`#4.${index + 1}: Test - For "${transport}" appClient remove newUser`, async () => {
        if(!myAccessToken) return;
        const service = appClient.service('users');
        const user = await service.remove(userId);
        if (true && user) logger.info(chalk.yellow(`"${transport}" appClient remove newUser for id: ("${userId}") - OK`));
        assert.ok(user.email === newUser.email, `"${transport}" appClient dosn't remove lastUser`);
      });
    });
  });
});

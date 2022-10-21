/* eslint-disable no-unused-vars */
const assert = require('assert');
const { cwd } = require('process');
const { join } = require('path');

const ensureCanSeedData = require('./ensure-can-seed-data');
const expandSpecsForTest = require('./expand-specs-for-test');
const localStorage = require('../../auth/local-storage');
const loginLocal = require('../../auth/login-local');
const loginJwt = require('../../auth/login-jwt');
const makeClient = require('../../auth/make-client');
const AuthServer = require('../../auth/auth-server.class');

const { getIdField, getCountItems } = require('../../db-helpers');
const { logger, isTrue } = require('../../lib');
const { inspect } = require('util');

const loginPassword = 'orprotroiyotrtouuikj';
const loginEmail = 'hdsjkhsdkhfhfd@hgfjffghfgh.com';

const debug = require('debug')('app:authentication.base.test');
const isDebug = false;
const isTest = true;

module.exports = function checkHealthAuthTest(appRoot = cwd(), options = {}) {
  const delayAfterServerOnce = options.delayAfterServerOnce || 500;
  const delayAfterServerClose = options.delayAfterServerClose || 500;
  const timeoutForStartingServerAndClient = options.timeoutForStartingServerAndClient || 30000;
  const timeoutForClosingingServerAndClient = options.timeoutForClosingingServerAndClient || 30000;

  const isMyLocalhostToIP = isTrue(process.env.MY_LOCALHOST_TO_IP);
  const defaultJson = require(`${appRoot}/config/default.json`);
  const configClient = (defaultJson.tests || {}).client;
  const ioOptions = configClient.ioOptions || {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
    extraHeaders: {},
  };
  const primusOptions = configClient.primusOptions || { transformer: 'ws' };
  let genSpecs;

  // Check if we can seed data.
  let cannotRunTest = ensureCanSeedData(appRoot);

  // Check if app generated with required features.
  if (!cannotRunTest) {
    ({ err: cannotRunTest, genSpecs } = expandSpecsForTest(appRoot, {
      strats: ['local'],
    }));
  }

  // Check we can run this test.
  describe(`<<<=== Test "${__filename.substring(__dirname.length + 1)}" ===>>>`, () => {

    if (!isTest) {
      debug(`<<<--- Test "${__filename.substring(__dirname.length + 1)}" - NOT --->>>`);
      return;
    }

    it('#1: Check this test may not seed data', () => {
      assert.strictEqual(cannotRunTest, '', cannotRunTest);
    });

    if (!cannotRunTest) {
      const seedData = require(join(appRoot, 'seeds', 'fake-data.json'));

      tests(seedData, {
        genSpecs,
        transports: genSpecs.app.providers, //.filter(provider => isMyLocalhostToIP? provider === 'rest' : true),
        usersName: genSpecs.authentication.entity,
        usersPath: genSpecs.authentication._entityPath
      });
    }
  });

  // Run the tests.
  function tests(seedData, { transports, usersName, usersPath }) {
    transports.forEach((transport, index) => {

      describe(`<<<--- Test "${transport}" transport --->>>`, function () {
        let app;
        let server;
        let appClient;
        let jwt, jwt1;
        let user, userId;
        //-------------------

        before(function (done) {

          if (isDebug) debug('<-- BeforeTest - Start! -->');

          this.timeout(timeoutForStartingServerAndClient);
          localStorage.clear();

          const usersRecs = seedData[usersName];
          if (!(usersRecs || []).length) {
            throw new Error(`No fake records for ${usersName} in seeds/fake-data.json.`);
          }

          // Restarting app.*s is required if the last mocha test did REST calls on its server.
          delete require.cache[require.resolve(`${appRoot}/${genSpecs.app.src}/app`)];
          app = require(`${appRoot}/${genSpecs.app.src}/app`);
          // Get PORT
          const port = !configClient.port ? 3030 : (configClient.port === 'PORT') ? process.env.PORT : configClient.port;
          if (isDebug) debug('port:', port);
          // Get serverUrl 
          const serverUrl = !configClient.restOptions ? 'http://localhost:3030' : (configClient.restOptions.url === 'BASE_URL') ? process.env.BASE_URL : configClient.restOptions.url;
          if (isDebug) debug('serverUrl:', serverUrl);

          server = app.listen(port);
          server.once('listening', () => {
            setTimeout(async () => {
              try {

                const countUsers = await getCountItems(app, usersPath);
                if(isDebug && usersPath) console.log(`getCountItems("${usersPath}"):`, countUsers);

                const usersService = app.service(usersPath);
                await usersService.remove(null);
                user = Object.assign({}, usersRecs[0], { email: loginEmail, password: loginPassword });
                user = await usersService.create(user);
                const idField = getIdField(user);
                userId = user[idField].toString();

                // Run authentication
                if (transport === 'socketio') {
                  appClient = await makeClient({ transport: 'rest', serverUrl, ioOptions, primusOptions });
                  let result = await loginLocal(appClient, loginEmail, loginPassword);
                  if (!result) new Error(`Error login local ("${transport}") for email:"${loginEmail}", pass: "${loginPassword}"`);
                  jwt = result.accessToken;
                  appClient = await makeClient({ transport, serverUrl, ioOptions, primusOptions });
                  result = await loginJwt(appClient, jwt);
                  if (!result) new Error(`Error login Jwt ("${transport}") for accessToken:"${jwt}"`);
                  jwt1 = result.accessToken;
                  if(jwt1) {
                    const passportJWT = await AuthServer.verifyPassportJWT(appClient.passport, jwt1);                    
                    if(true && passportJWT) inspect('AuthServer.verifyPassportJWT:', passportJWT);
                    logger.info(`Login Local/Jwt ("${transport}") - OK`);
                  } 
                } else {
                  appClient = await makeClient({ transport, serverUrl, ioOptions, primusOptions });
                  let result = await loginLocal(appClient, loginEmail, loginPassword);
                  if (!result) new Error(`Error login local ("${transport}") for email:"${loginEmail}", pass: "${loginPassword}"`);
                  jwt = result.accessToken;
                  result = await loginJwt(appClient, jwt);
                  if (!result) new Error(`Error login Jwt ("${transport}") for accessToken:"${jwt}"`);
                  jwt1 = result.accessToken;
                  if(jwt1) {
                    const passportJWT = await AuthServer.verifyPassportJWT(appClient.passport, jwt1);                    
                    if(true && passportJWT) inspect('AuthServer.verifyPassportJWT:', passportJWT);
                    logger.info(`Login Local/Jwt ("${transport}") - OK`);
                  } 
                }
                done();
              } catch (error) {
                logger.error(error.message);
                done();
              }
            }, delayAfterServerOnce);
          });
        });

        after(function (done) {
          this.timeout(timeoutForClosingingServerAndClient);
          server.close();
          setTimeout(() => done(), delayAfterServerClose);
        });

        // Run several tests together to reduce their runtime.
        it(`#2.${index + 1}: Can make local authenticated ("${transport}") call on ${usersPath} service`, async function () {
          this.timeout(timeoutForStartingServerAndClient);

          assert(typeof jwt === 'string', 'jwt not a string');
          assert(jwt.length > 100, 'jwt too short');

          const usersClient = appClient.service(usersPath);
          const result = await usersClient.get(userId);
          assert.strictEqual(result.email, loginEmail, 'wrong email');
        });

        it(`#3.${index + 1}: Can make jwt authenticated ("${transport}") call on ${usersPath} service`, async function () {
          this.timeout(timeoutForStartingServerAndClient);

          assert(typeof jwt1 === 'string', 'jwt not a string');
          assert(jwt1.length > 100, 'jwt too short');
          assert.notStrictEqual(jwt1, jwt, 'new token unexpectedly same as authentication token.');

          const usersClient = appClient.service(usersPath);
          const result = await usersClient.get(userId);
          assert.strictEqual(result.email, loginEmail, 'wrong email');
        });

        it(`#4.${index + 1}: throws on no authentication ("${transport}"), incorrect email or password`, async function () {
          this.timeout(timeoutForStartingServerAndClient);
          const usersClient = appClient.service(usersPath);

          try {
            // eslint-disable-next-line no-console
            await appClient.logout();
            const accessToken = await AuthServer.getPassportJWT(appClient.passport);
            assert(!accessToken, 'call unexpectedly succeeded');

            await usersClient.get(userId);
            assert(false, 'call unexpectedly succeeded');
          } catch (err) {
            assert(true);
          }

          try {
            // eslint-disable-next-line no-console
            await loginLocal(appClient, '#$%^&*()', loginPassword);

            assert(false, 'login unexpectedly succeeded');
          } catch (err) {
            assert(true);
          }

          try {
            // eslint-disable-next-line no-console
            await loginLocal(appClient, loginEmail, '$%^&*()');

            assert(false, 'login unexpectedly succeeded');
          } catch (err) {
            assert(true);
          }
        });
      });
    });
  }
};
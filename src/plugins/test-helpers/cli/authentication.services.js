/* eslint-disable no-unused-vars */
const assert = require('assert');
const { cwd } = require('process');
const { join } = require('path');
const loPick = require('lodash/pick');
const chalk = require('chalk');

const ensureCanSeedData = require('./ensure-can-seed-data');
const expandSpecsForTest = require('./expand-specs-for-test');
const { getIdField, getFakeData, clearCacheApp } = require('../service-helper');
const localStorage = require('../../auth/local-storage');
const loginLocal = require('../../auth/login-local');
const loginJwt = require('../../auth/login-jwt');
const makeClient = require('../../auth/make-client');
const AuthServer = require('../../auth/auth-server.class');
const { getCountItems } = require('../../db-helpers');
const { isTrue, inspector, logger } = require('../../lib');

const debug = require('debug')('app:authentication.services.test');
const isDebug = false;
const isTest = true;


const testConfig = {
  service: '*', // '*' | 'users' | 'roles' | 'teams' | 'userTeams' | 'userProfiles' | 'logMessages'
  metod: '*' // '*' | 'create' | 'find' | 'get' |'update' | 'patch' | 'remove'
};

const loginPassword = 'orprotroiyotrtouuikj';
const loginEmail = 'hdsjkhsdkhfhfd@hgfjffghfgh.com';
// Get user data
const usersFakeData = getFakeData()['users'];
let firstUser = usersFakeData[0];
firstUser = Object.assign({}, firstUser, { email: loginEmail, password: loginPassword });
const idField = getIdField(firstUser);
const userId = firstUser[idField];
const _usersFakeData = usersFakeData.filter(usr => usr[idField] !== userId);

let isMyLocalhostToIP = false;

module.exports = function checkHealthAuthTest(appRoot = cwd(), options = {}) {
  const delayAfterServerOnce = options.delayAfterServerOnce || 500;
  const delayAfterServerClose = options.delayAfterServerClose || 500;
  const timeoutForStartingServerAndClient = options.timeoutForStartingServerAndClient || 30000;
  const timeoutForClosingingServerAndClient = options.timeoutForClosingingServerAndClient || 30000;

  const defaultJson = require(`${appRoot}/config/default.json`);

  const configClient = defaultJson.tests ? defaultJson.tests.client : {};

  const ioOptions = configClient.ioOptions || {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
    extraHeaders: {},
  };

  const primusOptions = configClient.primusOptions || { transformer: 'ws' };
  // Authentication is assumed active on each method for services generated with authentication.
  // No authentication is assumed active on each method for services generated without authentication.
  // Of course you could change this by removing or adding authenticate(strategy) hooks.
  // You could even disallow client access to some methods entirely.
  // Only such authentication or disallow changes need be specified here.
  // schedules: {
  //   patch:  'auth',    // authentication added to path method in service schedules
  //   update: 'noauth',  // authentication removed from update method in service schedules
  //   remove: 'disallow' // client cannot call remove method in service schedules
  // }
  const overriddenAuth = configClient.overriddenAuth || {};
  let genSpecs;

  // Check if we can seed data.
  let cannotRunTest = ensureCanSeedData(appRoot);

  // Check if app generated with required features.
  if (!cannotRunTest) {
    ({ err: cannotRunTest, genSpecs } = expandSpecsForTest(appRoot, {
      strats: ['local'],
      overriddenAuth,
    }));
    if (isDebug && genSpecs) inspector('authentication.services.genSpecs:', genSpecs);
  }

  // Check we can run this test.
  describe(`<<<=== Test "${__filename.substring(__dirname.length + 1)}" ===>>>`, () => {

    if (!isTest) { it('Not Test', () => { assert.ok(!isTest, '<--- Not Test --->'); }); return; } 

    it('#1: Check this test may not seed data', () => {
      try {
        if (cannotRunTest) logger.error(cannotRunTest);
        assert.strictEqual(cannotRunTest, '', cannotRunTest);
      } catch (error) {
        logger.error(error.message);
        assert.ok(false, 'Check this test may not seed data');
      }
    });

    if (!cannotRunTest) {
      const seedData = require(join(appRoot, 'seeds', 'fake-data.json'));

      isMyLocalhostToIP = isTrue(process.env.MY_LOCALHOST_TO_IP);

      tests(seedData, {
        genSpecs,
        // !!!!!!!!!!!!!!!!!!!!!!!
        transports: genSpecs.app.providers, //.filter(provider => isMyLocalhostToIP ? provider === 'socketio' : true),
        usersName: genSpecs.authentication.entity,
        usersPath: genSpecs.authentication._entityPath
      });
    }
  });

  // Run the tests.
  function tests(seedData, { genSpecs, transports, usersName, usersPath }) {
    if (isDebug && transports.length) console.log(`isMyLocalhostToIP: ${isMyLocalhostToIP}, transports: [${transports}]`);

    transports.forEach(transport => {

      describe(`<<<--- Test "${transport}" transport --->>>`, () => {
        testServices(true, transport, seedData, genSpecs, transports, usersName, usersPath);
        // !!!!!!!!!!!!!!!!!!!!!!!
        testServices(false, transport, seedData, genSpecs, transports, usersName, usersPath);
      });

    });
  }

  function testServices(ifAuth, transport, seedData, genSpecs, transports, usersName, usersPath) {
    describe(ifAuth ? '<<<--- With authentication --->>>' : '<<<--- Without authentication --->>>', function () {
      let app;
      let server;
      let appClient, appRestClient;
      let jwt;
      // let userId, _usersFakeData;
      //------------------

      before(function (done) {
        if (isDebug) debug('<-- BeforeTest - Start! -->');
        this.timeout(timeoutForStartingServerAndClient);
        localStorage.clear();

        const usersRecs = seedData[usersName];
        if (!(usersRecs || []).length) {
          throw new Error(`No fake records for ${usersName} in seeds/fake-data.json`);
        }

        // Restarting app.*s is required if the last mocha test did REST calls on its server.
        // delete require.cache[require.resolve(`${appRoot}/${genSpecs.app.src}/app`)];
        // app = require(`${appRoot}/${genSpecs.app.src}/app`);
        app = clearCacheApp();

        // Get PORT
        const port = !configClient.port ? 3030 : (configClient.port === 'PORT') ? process.env.PORT : configClient.port;
        if (isDebug && port) debug('port:', port);
        // Get serverUrl 
        const serverUrl = !configClient.restOptions ? 'http://localhost:3030' : (configClient.restOptions.url === 'BASE_URL') ? process.env.BASE_URL : configClient.restOptions.url;
        if (isDebug && serverUrl) debug('serverUrl:', serverUrl);

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

              // Login local for loginEmail, loginPassword
              let result = await loginLocal(appClient, loginEmail, loginPassword);
              if (true && result && result.accessToken) {
                jwt = result.accessToken;
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


          }, delayAfterServerOnce);
        });
      });

      after(function (done) {
        this.timeout(timeoutForClosingingServerAndClient);
        server.close();
        setTimeout(async () => {
          const isLogin = await AuthServer.isLoginJWT(appClient);
          if (isLogin) await appClient.logout();
          done();
        }, delayAfterServerClose);
      });

      const genServices = Object.assign({}, loPick(genSpecs.services, testConfig.service === '*' ? Object.keys(genSpecs.services) : testConfig.service));
      if (isDebug && genServices) inspector('authentication.services.genServices:', genServices);

      // Cycle for service names. e.g. "users"
      Object.keys(genServices).forEach((name, index) => {

        // !!!!!!!!!!!!!!!!!!!!!!!
        // if (name !== 'users') return;

        describe(`<<<--- Service "${name}" --->>>`, () => {
          const genService = genServices[name];
          const isAuthEntity = genService.isAuthEntity;
          const _authByMethod = genSpecs._authByMethod[name];
          const authByMethod = Object.assign({}, loPick(_authByMethod, testConfig.metod === '*' ? Object.keys(_authByMethod) : testConfig.metod));
          let ourSeedData = seedData[name];

          if (isDebug && authByMethod) inspector('authentication.services.authByMethod:', authByMethod);
          if (isDebug && ourSeedData) inspector('authentication.services.ourSeedData:', ourSeedData);


          if (!ourSeedData || !ourSeedData.length) {
            // eslint-disable-next-line no-console
            console.log(`SKIP service ${name} - no fake data.`);
            return;
          }

          const ourSeedId = 'id' in ourSeedData[0] ? 'id' : '_id';

          Object.keys(authByMethod).forEach((method, index2) => {

            // !!!!!!!!!!!!!!!!!!!!!!!
            // if (method !== 'create') return;

            const authThisMethod = authByMethod[method];

            let ifFail = authThisMethod === 'disallow' ?
              true : (ifAuth ? false : authThisMethod === 'auth');
            if (isAuthEntity && method === 'create') { // user-entity create has no authentication
              ifFail = false;
            }

            if (isDebug && method) debug(`<-- method: ${method}; displayCode: ${displayCode(ifFail, authThisMethod)} -->`);

            it(`#${index + 1}.${index2 + 1} "${name}" ${method} ("${transport}") ${displayCode(ifFail, authThisMethod)}.`, async () => {
              const service = appClient.service(genService.path);
              let prop;
              let rec, rec1;
              let callMethod, result;
              let _ourSeedData;
              //------------------------

              switch (method) {
              case 'create':

                if(name === 'users' && isAuthEntity){
                  _ourSeedData = ourSeedData.filter(usr => usr[idField] !== userId);
                } else {
                  _ourSeedData = ourSeedData;
                  await app.service(genService.path).remove(null);
                }

                callMethod = async () => await service.create(_ourSeedData);
                result = await runMethod(ifFail, callMethod);
                if (isDebug && result) inspector('authentication.services.result:', result);
                if (isDebug && result) inspector('authentication.services.ourSeedData:', ourSeedData);
                if (!ifFail) {
                  assert.strictEqual(resultLen(result), _ourSeedData.length, 'Unexpected result length.');
                } else {
                  assert(true);
                }
                break;
              case 'find':
                callMethod = async () => await service.find();
                result = await runMethod(ifFail, callMethod);
                if (isDebug && result) inspector('authentication.services.result:', result);
                if (!ifFail) assert.strictEqual(resultLen(result), ourSeedData.length, 'Unexpected result length.');
                break;
              case 'get':
                rec = ourSeedData[0];
                callMethod = async () => await service.get(rec[ourSeedId]);
                result = await runMethod(ifFail, callMethod);
                if (isDebug && result) inspector('authentication.services.get.result:', result);
                if (!ifFail) assert.strictEqual(resultLen(result), 1, 'Unexpected result length.');
                if (!ifFail) assert.strictEqual(result[ourSeedId], rec[ourSeedId], 'Unexpected record id');
                break;
              case 'patch':
                rec = ourSeedData[0];
                prop = Object.keys(rec)[1];
                callMethod = async () => await service.patch(rec[ourSeedId], { [prop]: rec[prop] });
                // result = await runMethod(ifFail, () => service.patch(rec[ourSeedId], { [prop]: ourSeedData[1][prop] }));
                //!!!!!!!!!!!!!!!! Update ourSeedData[1][prop] to rec[prop]
                result = await runMethod(ifFail, callMethod);
                if (isDebug && result) inspector('authentication.services.patch.result:', result);
                //!!!!!!!!!!!!!!!!
                if (!ifFail) assert.strictEqual(resultLen(result), 1, 'Unexpected result length.');
                break;
              case 'update':
                rec = ourSeedData[0];
                rec1 = Object.assign({}, rec);
                rec1[ourSeedId] = rec[ourSeedId];
                callMethod = async () => await service.update(rec[ourSeedId], rec1);
                result = await runMethod(ifFail, () => callMethod);
                if (isDebug && result) inspector('authentication.services.result:', result);
                if (!ifFail) assert.strictEqual(resultLen(result), 1, 'Unexpected result length.');
                break;
              case 'remove':
                rec = ourSeedData[isAuthEntity ? 1 : 0];
                callMethod = async () => await service.remove(rec[ourSeedId]);
                result = await runMethod(ifFail, callMethod);
                if (isDebug && result) inspector('authentication.services.remove.result:', result);
                if (!ifFail) assert.strictEqual(resultLen(result), 1, 'Unexpected result length.');
                if (!ifFail) assert.deepStrictEqual(result[ourSeedId], rec[ourSeedId], 'Unexpected record id');
                break;
              }
            });
          });
        });
      });
    });
  }
};

function displayCode(ifFail, authThisMethod) {
  const part1 = ifFail ? 'should fail' : 'should succeed';
  const part2 = authThisMethod === 'disallow'
    ? 'configured to disallow clients'
    : (authThisMethod === 'auth' ? 'configured with auth' : 'configured without auth');
  return `${part1}: ${part2}`;
}

async function runMethod(shouldFail, callMethod) {
  try {
    const result = await callMethod();
    if (shouldFail) {
      throw new Error('Call unexpectedly succeeded.');
    }
    return result;
  } catch (err) {
    if (!shouldFail) {
      throw new Error('Call unexpectedly failed.');
    }
    return null;
  }
}

function resultLen(result) {
  if (!result) return -1;

  if (result.data) return result.data.length;
  return Array.isArray(result) ? result.length : 1;
}

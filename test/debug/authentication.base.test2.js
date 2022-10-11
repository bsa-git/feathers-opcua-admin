/* eslint-disable no-unused-vars */
const assert = require('assert');
const rp = require('request-promise');
const url = require('url');
const app = require('../../src/app');

const { cwd } = require('process');
const { join } = require('path');

const {
  appRoot,
  inspector,
  logger,
  pause,
  doesUrlExist,
  isUrlExist,
  isTrue,
  ensureCanSeedData,
  expandSpecsForTest,
  localStorage,
  loginLocal,
  loginJwt,
  makeClient,
  getIdField
} = require('../../src/plugins');

const delayAfterServerOnce = 500;
const delayAfterServerClose = 500;
const timeoutForStartingServerAndClient = 30000;
const timeoutForClosingingServerAndClient = 30000;

const debug = require('debug')('app:authentication.base.test');
const isDebug = false;
const isTest = true;

const loginPassword = 'orprotroiyotrtouuikj';
const loginEmail = 'hdsjkhsdkhfhfd@hgfjffghfgh.com';
let newUser = null;
let idField = '';

const defaultJson = require(`${appRoot}/config/default.json`);
const configClient = (defaultJson.tests || {}).client;
// Get port
const port = !configClient.port ? 3030 : (configClient.port === 'PORT') ? process.env.PORT : configClient.port;
if (isDebug && port) console.log('port:', port);
// Get server url
const serverUrl = !configClient.restOptions ? 'http://localhost:3030' : (configClient.restOptions.url === 'BASE_URL') ? process.env.BASE_URL : configClient.restOptions.url;
if (isDebug && serverUrl) console.log('serverUrl:', serverUrl);

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

// const port = app.get('port') || 3030;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('<<<=== Feathers application tests ===>>>', () => {
  let server;

  before(function (done) {
    server = app.listen(port);
    server.once('listening', () => {
      setTimeout(() => { done();}, delayAfterServerOnce);
    });
  });

  after(function (done) {
    server.close();
    setTimeout(() => done(), delayAfterServerClose);
  });

  it(`#1: Is url - "${getUrl()}" exist`, async () => {
    // this.timeout(timeoutForStartingServerAndClient);
    // await pause(5000);
    const _url = getUrl();
    const _isUrlExist = await isUrlExist(_url);
    if (isDebug && _isUrlExist) console.log(`Url "${_url}" exist!`);
    assert.ok(_isUrlExist, `Is url="${_url}" exist`);
  });

  // Check we can run this test.
  describe(`<<< Test "${__filename.substring(__dirname.length + 1)}" >>>`, () => {

    if (!isTest) {
      debug(`<<< Test "${__filename.substring(__dirname.length + 1)}" - NOT >>>`);
      return;
    }

    it('#2: Check this test may not seed data', () => {
      assert.strictEqual(cannotRunTest, '', cannotRunTest);
    });

    if (!cannotRunTest) {
      const seedData = require(join(appRoot, 'seeds', 'fake-data.json'));
      const isMyLocalhostToIP = isTrue(process.env.MY_LOCALHOST_TO_IP);
      tests(seedData, {
        transports: genSpecs.app.providers.filter(provider => isMyLocalhostToIP ? provider === 'rest' : true),
        usersName: genSpecs.authentication.entity,
        usersPath: genSpecs.authentication._entityPath
      });
    }
  });
});


// Run the tests.
function tests(seedData, { transports, usersName, usersPath }) {

  // Clear localStorage
  localStorage.clear();

  it(`#3: Create user for app.service("${usersPath}")`, async () => {

    const usersRecs = seedData[usersName];
    if (!(usersRecs || []).length) {
      throw new Error(`No fake records for ${usersName} in seeds/fake-data.json.`);
    }

    const usersService = app.service(usersPath);
    await usersService.remove(null);
    const user = Object.assign({}, usersRecs[0], { email: loginEmail, password: loginPassword });
    newUser = await usersService.create(user);
    idField = getIdField(newUser);
    if (isDebug && newUser) console.log('newUser:', newUser);
    assert.ok(newUser, 'Create user');

  });

  transports.forEach((transport, index) => {

    describe(`<<< Test "${transport}" transport >>>`, function () {
      let appClient;
      let jwt;
      //--------------------------------------------------------

      it(`#4.${index + 1} Create appClient for "${transport}"`, async function () {

        appClient = await makeClient({ transport, serverUrl, ioOptions, primusOptions });

        assert.ok(appClient, `Create appClient for "${transport}"`);
      });

      it(`#5.${index + 1} Can make local authenticated call on ${usersPath} service`, async function () {
        // this.timeout(timeoutForStartingServerAndClient);

        await loginLocal(appClient, loginEmail, loginPassword);
        jwt = localStorage.getItem('feathers-jwt');
        if (isDebug && jwt) console.log('localStorage.getItem("feathers-jwt"):', jwt);
        assert.ok(typeof jwt === 'string', 'jwt not a string');
        assert.ok(jwt.length > 100, 'jwt too short');

        const usersClient = appClient.service(usersPath);
        if (idField && usersClient) {
          const userId = newUser[idField].toString();
          const user = await usersClient.get(userId);
          if (isDebug && user) console.log('usersClient.find.user:', user);
          assert.strictEqual(user.email, loginEmail, 'wrong email');
        }
      });


      it(`#6.${index + 1} Can make jwt authenticated call on ${usersPath} service`, async function () {
        // this.timeout(timeoutForStartingServerAndClient);

        await loginJwt(appClient, jwt);
        const jwt1 = localStorage.getItem('feathers-jwt');
        if (isDebug && jwt1) console.log('localStorage.getItem("feathers-jwt"):', jwt1);

        assert(typeof jwt1 === 'string', 'jwt not a string');
        assert(jwt1.length > 100, 'jwt too short');
        assert.notStrictEqual(jwt1, jwt, 'new token unexpectedly same as authentication token.');

        const usersClient = appClient.service(usersPath);
        if (idField && usersClient) {
          const userId = newUser[idField].toString();
          const user = await usersClient.get(userId);
          if (isDebug && user) console.log('usersClient.find.user:', user);
          assert.strictEqual(user.email, loginEmail, 'wrong email');
        }
      });
      /** 
      it(`#7.${index + 1} throws on no authentication, incorrect email or password`, async function () {
        // this.timeout(timeoutForStartingServerAndClient);
        const usersClient = appClient.service(usersPath);

        try {
          // eslint-disable-next-line no-console
          await usersClient.find({ query: { email: loginEmail } });
          assert(false, 'call unexpectedly succeeded');
        } catch (err) {
          logger.error(`The requested URL could not be retrieved! usersClient.find({ query: { email: "${loginEmail}"} })`);
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
      */
    });
  });
}


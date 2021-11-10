/* eslint-disable no-unused-vars */
const assert = require('assert');
const app = require('../../src/app');
const port = app.get('port') || 3131;
const {
  appRoot,
  inspector,
  isUrlExist
} = require('../../src/plugins/lib');

const {
  localStorage,
  loginLocal,
  feathersClient,
  makeClient
} = require('../../src/plugins/auth');

const {
  saveFakesToServices
} = require('../../src/plugins/test-helpers');

const { readJsonFileSync } = require('@feathers-plus/test-utils');
// Get generated fake data
const fakes = readJsonFileSync(`${appRoot}/seeds/fake-data.json`) || {};
const fakeUsers = fakes['users'];
const fakeUser = fakeUsers[0];

const debug = require('debug')('app:data-management.test');
const isLog = false;
const isDebug = false;
const isTest = true;

const baseUrl = process.env.BASE_URL;
const serverUrl = 'http://localhost:3030';

const id = 'ua-cherkassy-azot-asutp_dev1';

describe('<<< Test /services/data-management.test.js >>>', () => {

  if (!isTest) {
    debug('<<< Test /services/data-management.test.js >>> - NOT >>>');
    return;
  }

  before(function (done) {
    server = app.listen(port);
    server.once('listening', () => {
      setTimeout(async () => {
        // await saveFakesToServices(app, 'users');
        if (isDebug) debug('Done before StartTest!');
        done();
      }, 500);
    });
  });

  after(function (done) {
    server.close();
    setTimeout(() => {
      if (isDebug) debug('Done after EndTest!');
      done();
    }, 500);
  });

  it('#1. Registered the service', () => {
    let service = app.service('data-management');
    assert.ok(service, 'Registered the service');
    service = feathersClient.service('data-management');
    assert.ok(service, 'Registered the service');
  });

  it('#2. feathersClient read flight json data from "dataManagement" service', async () => {
    const service = feathersClient.service('data-management');
    const data = {
      action: 'readJsonFile',
      path: '/public/api/demo/echarts/flight-data.json'
    };
    const flightData = await service.create(data);
    if (isLog) inspector('data-management.test.flightData from "dataManagement" service:', flightData);
    // inspector('data-management.test.flightData from "dataManagement" service:', flightData);
    assert.ok(Object.keys(flightData).length, 'OK - Read flight json data from "dataManagement" service');
  });

  it('#3. OPC-UA clients: registered the service', async () => {

    if (!isUrlExist(serverUrl)) return;

    const appClient = await makeClient({ serverUrl });
    const service = appClient.service('opcua-clients');
    assert.ok(service, 'OPC-UA clients: registered the service');
  });

  it('#4. OPC-UA servers: registered the service', async () => {

    if (!isUrlExist(serverUrl)) return;

    const appClient = await makeClient({ serverUrl });
    const service = appClient.service('opcua-servers');
    assert.ok(service, 'OPC-UA servers: registered the service');
  });

  it('#5. OPC-UA clients: operations with service', async () => {

    if (!isUrlExist(serverUrl)) return;

    const appClient = await makeClient({ serverUrl });
    const service = appClient.service('opcua-clients');
    // Get client service
    const opcuaClient = await service.get(id);
    assert.ok(opcuaClient, 'OPC-UA clients: get the service');
    // Find client services
    const opcuaClients = await service.find();
    assert.ok(opcuaClients.length, 'OPC-UA clients: find services');
    // Get client currentState
    let data = { id, action: 'getCurrentState' };
    const currentState = await service.create(data);
    inspector('clientCurrentState:', currentState);
    assert.ok(currentState, 'OPC-UA clients: get service currentState');
    // Get clientInfo
    data = { id, action: 'getClientInfo' };
    const clientInfo = await service.create(data);
    // inspector('clientInfo:', clientInfo);
    assert.ok(clientInfo, 'OPC-UA clients: get clientInfo');
  });

  it('#6. Get getItemNodeId from "dataManagement" service', async () => {

    if (!isUrlExist(serverUrl)) return;

    const service = feathersClient.service('data-management');
    const data = {
      id,
      action: 'opcuaClient',
      opcuaAction: 'getItemNodeId',
      opcuaURL: serverUrl,
      nameNodeId: 'CH_M51::ValueFromFile'
    };

    const actionResult = await service.create(data);
    if (isLog) inspector('opcuaClient.getItemNodeId.readResult:', actionResult);
    inspector('opcuaClient.getItemNodeId.readResult:', actionResult);
    assert.ok(actionResult, 'Get getItemNodeId from "dataManagement" service');

  });

  it('#7. Get sessionReadHistoryValues from "dataManagement" service', async () => {

    if (!isUrlExist(serverUrl)) return;

    const service = feathersClient.service('data-management');
    const data = {
      id,
      action: 'opcuaClient',
      opcuaAction: 'getItemNodeId',
      opcuaURL: serverUrl,
      nameNodeId: 'CH_M51::ValueFromFile'
    };

    const actionResult = await service.create(data);
    if (isLog) inspector('opcuaClient.getItemNodeId.readResult:', actionResult);
    inspector('opcuaClient.getItemNodeId.readResult:', actionResult);
    assert.ok(actionResult, 'Get getItemNodeId from "dataManagement" service');

  });
});

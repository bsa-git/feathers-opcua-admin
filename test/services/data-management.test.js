/* eslint-disable no-unused-vars */
const assert = require('assert');
const app = require('../../src/app');
const port = app.get('port') || 3131;
const {
  appRoot,
  inspector,
  isUrlExist,
  getTime,
  readJsonFileSync
} = require('../../src/plugins/lib');

const {
  localStorage,
  loginLocal,
  // feathersClient,
  feathersRestClient,
  feathersSocketioClient,
  makeClient
} = require('../../src/plugins/auth');

const {
  saveFakesToServices
} = require('../../src/plugins/test-helpers');

const moment = require('moment');
const chalk = require('chalk');
const loRound = require('lodash/round');
const loForEach = require('lodash/forEach');
const logger = require('../../src/logger');

// const { readJsonFileSync } = require('@feathers-plus/test-utils');
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
    service = feathersRestClient.service('data-management');
    assert.ok(service, 'Registered the service');
  });

  it('#2.1 feathersClient ("rest") read json data from "dataManagement" service', async () => {
    const service = feathersRestClient.service('data-management');
    const data = {
      action: 'readJsonFile',
      path: '/public/api/demo/ui-elements/treeview-items4.json'
    };
    const flightData = await service.create(data);
    if (isDebug && flightData) inspector('data-management.flightData from "dataManagement" service:', flightData);
    assert.ok(Object.keys(flightData).length, 'OK - Read flight json data from "dataManagement" service');
  });

  // it('#2.2 feathersClient ("socketio") read json data from "dataManagement" service', async () => {
  //   const service = feathersSocketioClient.service('data-management');
  //   const data = {
  //     action: 'readJsonFile',
  //     path: '/public/api/demo/ui-elements/treeview-items4.json'
  //   };
  //   const flightData = await service.create(data);
  //   if (isDebug && flightData) inspector('data-management.flightData from "dataManagement" service:', flightData);
  //   assert.ok(Object.keys(flightData).length, 'OK - Read flight json data from "dataManagement" service');
  // });

  it('#3. OPC-UA clients: registered the service', async () => {

    if (! await isUrlExist(serverUrl)) return;

    const appClient = await makeClient({ serverUrl });
    const service = appClient.service('opcua-clients');
    assert.ok(service, 'OPC-UA clients: registered the service');
  });

  it('#4. OPC-UA servers: registered the service', async () => {

    if (! await isUrlExist(serverUrl)) return;

    const appClient = await makeClient({ serverUrl });
    const service = appClient.service('opcua-servers');
    assert.ok(service, 'OPC-UA servers: registered the service');
  });

  it('#5. OPC-UA clients: operations with service', async () => {

    if (! await isUrlExist(serverUrl)) return;

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
    // inspector('clientCurrentState:', currentState);
    assert.ok(currentState, 'OPC-UA clients: get service currentState');
    // Get clientInfo
    data = { id, action: 'getClientInfo' };
    const clientInfo = await service.create(data);
    // inspector('clientInfo:', clientInfo);
    assert.ok(clientInfo, 'OPC-UA clients: get clientInfo');
  });

  it('#6. Get getItemNodeId from "dataManagement" service', async () => {

    if (! await isUrlExist(serverUrl)) return;

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
    // inspector('opcuaClient.getItemNodeId.readResult:', actionResult);
    assert.ok(actionResult, 'Get getItemNodeId from "dataManagement" service');

  });

  it('#7. Get sessionReadHistoryValues from "dataManagement" service', async () => {
    let dataItems, histOpcuaValues = [], values = [], accumulator;
    let start, end;
    //-------------------------------------------
    if (! await isUrlExist(serverUrl)) return;

    // Get start time
    start = moment(0);
    // Get end time
    end = moment();


    const data = {
      id,
      action: 'opcuaClient',
      opcuaAction: 'sessionReadHistoryValues',
      opcuaURL: serverUrl,
      // opcuaCallback: 'cbSessionReadHistoryValues',
      nameNodeIds: 'CH_M51::ValueFromFile',
      start,
      end
    };
    const service = feathersClient.service('data-management');
    const actionResult = await service.create(data);
    if (isLog) inspector('opcuaClient.getItemNodeId.readResult:', actionResult);
    // inspector('opcuaClient.getItemNodeId.readResult:', actionResult);
    if (actionResult.length && actionResult[0].statusCode.value === 0) {
      if (actionResult[0].historyData.dataValues.length) {
        let dataValues = actionResult[0].historyData.dataValues;
        dataValues.forEach(dataValue => {
          if (dataValue.statusCode.value === 0) {
            const updatedAt = moment(dataValue.sourceTimestamp).format('YYYY-MM-DDTHH:mm:ss');
            const tagName = data.nameNodeIds;
            dataItems = JSON.parse(dataValue.value.value);
            values = [];
            loForEach(dataItems, function (value, key) {
              values.push({ key, value });
            });
            histOpcuaValues.push({ tagName, updatedAt, values });
            assert.ok(true, 'OPC-UA clients: session history value from file');
          } else {
            assert.ok(false, 'OPC-UA clients: session history value from file');
          }
        });
      } else {
        assert.ok(false, 'OPC-UA clients: session history value from file');
      }
    } else {
      assert.ok(false, 'OPC-UA clients: session history value from file');
    }
    if (isLog) inspector('SessionHistoryValue_ForCH_M51.histOpcuaValues:', histOpcuaValues);
    // inspector('SessionHistoryValue_ForCH_M51.histOpcuaValues:', histOpcuaValues);
    accumulator = histOpcuaValues.length;
    start = histOpcuaValues[0].updatedAt;
    end = histOpcuaValues[accumulator - 1].updatedAt;
    logger.info(`sessionHistoryValue.StartTime: ${chalk.yellow(start)}`);
    logger.info(`sessionHistoryValue.EndTime: ${chalk.yellow(end)}`);
    logger.info(`sessionReadHistoryValues.count: ${chalk.yellow(accumulator)}`);
    
    assert.ok(histOpcuaValues.length, 'Get sessionReadHistoryValues from "dataManagement" service');
  });
});

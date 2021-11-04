const assert = require('assert');
const app = require('../../src/app');
const { inspector } = require('../../src/plugins/lib');

const debug = require('debug')('app:data-management.test');
const isLog = false;
const isTest = true;

describe('<<< Test /services/data-management.test.js >>>', () => {

  if (!isTest) {
    debug('<<< Test /services/data-management.test.js >>> - NOT >>>');
    return;
  }

  it('registered the service', () => {
    const service = app.service('data-management');
    assert.ok(service, 'Registered the service');
  });

  it('Read flight json data from "dataManagement" service', async () => {
    const service = app.service('data-management');
    const flightData = await service.create({
      action: 'readJsonFile',
      path: '/public/api/demo/echarts/flight-data.json'
    });
    if (isLog) inspector('data-management.test.flightData from "dataManagement" service:', flightData);
    // inspector('data-management.test.flightData from "dataManagement" service:', flightData);
    assert.ok(Object.keys(flightData).length, 'OK - Read flight json data from "dataManagement" service');
  });
});

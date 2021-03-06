const assert = require('assert');
const { appRoot, checkServicesRegistered, saveFakesToServices } = require('../../src/plugins');
const app = require(`${appRoot}/src/app`);
const debug = require('debug')('app:user-teams.service.test');

const isTest = true;

describe('<<< Test services/user-teams.test.js >>>', () => {

  if (!isTest) {
    debug('<<< Test services/user-teams.test.js - NOT >>>');
    return;
  }

  it('registered the service', () => {
    const errPath = checkServicesRegistered(app, 'user-teams');
    assert.ok(errPath === '', `Service '${errPath}' not registered`);
  });

  it('Save fake data to \'userTeams\' service', async () => {
    const errPath = await saveFakesToServices(app, 'userTeams');
    assert.ok(errPath === '', `Not save fakes to services - '${errPath}'`);
  });
});

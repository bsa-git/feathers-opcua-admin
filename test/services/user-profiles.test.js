const assert = require('assert');
const { appRoot, checkServicesRegistered, saveFakesToServices } = require('../../src/plugins');
const app = require(`${appRoot}/src/app`);
const debug = require('debug')('app:user-profiles.test');

const isTest = true;

describe('<<< services/user-profiles.test.js >>>', () => {

  if (!isTest) {
    debug('<<< Test services/user-profiles.test.js - NOT >>>');
    return;
  }

  it('registered the service', () => {
    const errPath = checkServicesRegistered(app, 'user-profiles');
    assert.ok(errPath === '', `Service '${errPath}' not registered`);
  });

  it('Save fake data to \'user-profiles\' service', async () => {
    const errPath = await saveFakesToServices(app, 'userProfiles');
    assert.ok(errPath === '', `Not save fakes to services - '${errPath}'`);
  });
});

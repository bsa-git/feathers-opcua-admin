const assert = require('assert');
const { readJsonFileSync, appRoot, checkServicesRegistered, saveFakesToServices } = require('../../src/plugins');
const app = require(`${appRoot}/src/app`);
const debug = require('debug')('app:users.test');

const isDebug = false;
const isTest = true;

// Get generated fake data
const fakes = readJsonFileSync(`${appRoot}/seeds/fake-data.json`) || {};

describe('<<< Test services/users.test.js >>>', () => {

  if (!isTest) {
    debug('<<< Test services/users.test.js - NOT >>>');
    return;
  }

  it('registered the service', () => {
    const errPath = checkServicesRegistered(app, 'users');
    assert.ok(errPath === '', `Service '${errPath}' not registered`);
  });

  it('Save fake data to \'users\' service', async () => {
    const errPath = await saveFakesToServices(app, 'users');
    assert.ok(errPath === '', `Not save fakes to services - '${errPath}'`);
  });

  it('Error on incorrect email', async function () {
    try {
      const users = app.service('users');
      await users.create({ email: 'my@test.', password: 'my', firstName: 'Lora', lastName: 'Lind' });
      assert(false, 'email unexpectedly succeeded');
    } catch (ex) {
      if (isDebug) debug('Error on incorrect email for \'users\' service:', ex);
      assert.strictEqual(ex.code, 400, 'unexpected error.code');
      assert.strictEqual(ex.message, 'Data does not match schema');
      assert.strictEqual(ex.name, 'BadRequest', 'unexpected error.name');
    }
  });

  it('Error on unique email', async function () {
    let fake;
    try {
      fake = fakes['users'][0];
      // debug('Error on unique email for \'users\' fake:', fake);
      const users = app.service('users');
      await users.create({ email: fake.email, password: 'test', firstName: 'Lora', lastName: 'Lind' });
      assert(false, 'email unexpectedly succeeded');
    } catch (ex) {
      if (isDebug) debug('Error on unique email for \'users\' service:', ex);
      assert.ok((ex.message === 'email: value already exists.') || (ex.message === `email: ${fake.email} already exists.`));
    }
  });

  it('Error on unique profileId', async function () {
    let fake;
    try {
      fake = fakes['users'][0];
      const users = app.service('users');
      await users.create({ email: 'test@test.com', password: 'test', firstName: 'Lora', lastName: 'Lind', profileId: fake.profileId });
      assert(false, 'email unexpectedly succeeded');
    } catch (ex) {
      if (isDebug) debug('Error on unique profileId for \'users\' service:', ex);
      assert.ok((ex.message === 'profileId: value already exists.') || (ex.message === `profileId: ObjectId('${fake.profileId}') already exists.`));
    }
  });
});

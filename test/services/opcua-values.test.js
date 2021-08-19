const assert = require('assert');
const app = require('../../src/app');

describe('\'opcuaValues\' service', () => {
  it('registered the service', () => {
    const service = app.service('opcua-values');

    assert.ok(service, 'Registered the service');
  });
});

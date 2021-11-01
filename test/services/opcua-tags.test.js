const assert = require('assert');
const app = require('../../src/app');

describe('<<=== Opcua-Tags Service Test (opcua-tags.test.js) ===>>', () => {
  it('registered the service', () => {
    const service = app.service('opcua-tags');

    assert.ok(service, 'Registered the service');
  });
});

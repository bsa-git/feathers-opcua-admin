const assert = require('assert');
const app = require('../../src/app');

describe('\'opcuaTags\' service', () => {
  it('registered the service', () => {
    const service = app.service('opcua-tags');

    assert.ok(service, 'Registered the service');
  });
});

const assert = require('assert');
const rp = require('request-promise');
const URL = require('url').URL;
const app = require('../src/app');
const port = app.get('port') || 3131;

/**
 * Get URL
 * @method getURL
 * @param {String} pathname 
 * @returns {String}
 */
const getURL = (pathname = '') => {
  const port = app.get('port') || 3131;
  const host = app.get('host') || 'localhost';
  let url = new URL(pathname, `http://${host}:${port}`);
  url = url.toString();
  return url;
}; 

describe('Feathers application tests', () => {
  let server;

  before(function (done) {
    server = app.listen(port);
    server.once('listening', () => {
      setTimeout(() => done(), 500);
    });
  });

  after(function (done) {
    server.close();
    setTimeout(() => done(), 500);
  });

  it('starts and shows the index page', () => {
    return rp(getURL()).then(body =>
      assert.ok(body.indexOf('<html>') !== -1, 'response does not contain <html>')
    );
  });

  describe('404', function () {
    it('shows a 404 HTML page', () => {
      return rp({
        url: getURL('path/to/nowhere'),
        headers: {
          Accept: 'text/html'
        }
      }).catch(res => {
        assert.strictEqual(res.statusCode, 404, 'unexpected statusCode');
        assert.ok(res.error.indexOf('<html>') !== -1, 'error does not contain <html>');
      });
    });

    it('shows a 404 JSON error without stack trace', () => {
      return rp({
        url: getURL('path/to/nowhere'),
        json: true
      }).catch(res => {
        assert.strictEqual(res.statusCode, 404, 'unexpected statusCode');
        assert.strictEqual(res.error.code, 404, 'unexpected error.code');
        assert.strictEqual(res.error.message, 'Page not found', 'unexpected error.message');
        assert.strictEqual(res.error.name, 'NotFound', 'unexpected error.name');
      });
    });
  });
});
